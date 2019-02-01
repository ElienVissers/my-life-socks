const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const db = require('./db');
const bcrypt = require('./bcrypt');
const csurf = require('csurf');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const config = require('./config');

app.use(cookieSession({
    secret: `Token that the request came from my own site! :D`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(require('body-parser').json());
app.use(compression());
app.use(express.static('./public'));
app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////////////////////////////////////////////////////////////////////// image upload boilerplate

//takes the uploaded file, gives it a unique name of 24 characters (uidSafe)+ the original file extension (path), stores it in our /uploads folder
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

//actually doing the uploading
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

////////////////////////////////////////////////////////////////////////////////

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/welcome/register', (req, res) => {
    bcrypt.hash(req.body.password).then(hashedPassword => {
        return db.registerUser(req.body.first, req.body.last, req.body.email, hashedPassword);
    }).then(({rows}) => {
        req.session.userId = rows[0].id;
        res.json({success: true});
    }).catch(function(err) {
        console.log("error in registration: ", err);
        res.json({success: false});
    });
});

app.post('/welcome/login', (req, res) => {
    var userId;
    db.getUserInfo(req.body.email).then(dbInfo => {
        if (dbInfo.rows[0]) {
            userId = dbInfo.rows[0].id;
            return bcrypt.compare(req.body.password, dbInfo.rows[0].password);
        } else {
            res.json({notRegistered: true});
        }
    }).then(() => {
        req.session.userId = userId;
        res.json({success: true});
    }).catch(function(err) {
        console.log("error in login: ", err);
        res.json({success: false});
    });
});

app.get('/user', (req, res) => {
    db.getUserAppInfo(req.session.userId).then(dbInfo => {
        res.json(dbInfo);
    }).catch(err => {
        console.log("error in /user: ", err);
    });
});

app.post('/profilepic/upload', uploader.single('uploadedFile'), s3.upload, (req, res) => {
    // console.log('First middleware function: the image has been uploaded to the /uploads folder. Second middleware function: image has been uploaded to the imageboardspiced bucket on AWS s3 and removed from /uploads folder.');
    //save url, username, title and description in the images table
    db.addImage(config.s3Url + req.file.filename, req.session.userId).then(({rows}) => {
        res.json(rows[0].url);
    });
});

app.post('/bio/edit', (req, res) => {
    db.updateBio(req.session.userId, req.body.bio).then((dbInfo) => {
        res.json(dbInfo.rows[0].bio);
    }).catch(err => {
        console.log("error while updating bio: ", err);
        res.json({error: true});
    });
});

app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
