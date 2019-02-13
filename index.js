const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' }); //change origins if you want to deploy
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

let onlineUsers = {};

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


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

app.post('/socks/edit', (req, res) => {
    db.updateSocks(req.body.color, req.body.shape, req.session.userId).then(dbInfo => {
        res.json(dbInfo.rows[0]);
    }).catch(err => {
        console.log("error while updating socks: ", err);
    });
});

app.get('/user/:id.json', (req, res) => {
    if (req.session.userId == req.params.id) {
        return res.json({redirectTo: '/'});
    }
    db.getUserAppInfo(req.params.id).then(dbInfo => {
        res.json(dbInfo);
    }).catch(err => {
        console.log("error in getting OtherUserById: ", err);
    });
});

app.get('/friendshipstatus/:otherid/initial', (req, res) => {
    db.getFriendshipStatus(req.session.userId, req.params.otherid).then(dbInfo => {
        res.json(dbInfo);
    }).catch(err => {
        console.log("error in getting friendshipstatus: ", err);
    });
});

app.post('/friendshipstatus/:otherid/update', (req, res) => {
    if (req.body.action == 'ADD FRIEND') {
        db.addFriendship(req.session.userId, req.params.otherid).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error while adding friendship: ', err);
        });
    } else if (req.body.action == 'CANCEL FRIEND REQUEST' || req.body.action == 'REMOVE FRIEND' ) {
        db.removeFriendship(req.session.userId, req.params.otherid).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error while removing friendship: ', err);
        });
    } else if (req.body.action == 'ACCEPT FRIEND REQUEST') {
        db.updateFriendship(req.session.userId, req.params.otherid).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error while updating friendship: ', err);
        });
    }
});

app.get('/friends/list', (req, res) => {
    db.getFriendshipLists(req.session.userId).then(dbInfo => {
        res.json(dbInfo);
    }).catch(err => {
        console.log("error while getting friendshiplists: ", err);
    });
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/welcome');
});

app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});


io.on('connection', function(socket) {

    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    socket.emit('userId', userId);
    onlineUsers[socket.id] = userId;

    let userIds = Object.values(onlineUsers);

    //onlineUsers data flow
    db.getUsersByIds(userIds).then(results => {
        socket.emit('onlineUsers', results.rows.filter(
            i => {
                if (i.id == userId) {
                    return false;
                } else {
                    return true;
                }
            }
        ));
    });

    //userJoined data flow
    var filteredOwnUserIds = userIds.filter(id => id == userId);
    if (filteredOwnUserIds.length == 1) {
        db.getUserAppInfo(userId).then(results => {
            socket.broadcast.emit('userJoined', results.rows);
        });
    }

    //userLeft data flow
    socket.on('disconnect', function() {
        delete onlineUsers[socket.id];
        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            io.sockets.emit('userLeft', userId);
        }
    });

    //load chatMessages data flow
    db.getChatMessages().then(results => {
        socket.emit('chatMessages', results.rows);
    }).catch(err => {
        console.log("error while loading chatMessages: ", err);
    });

    //add chatMessage data flow
    socket.on('chatMessageFromUserInput', async text => {
        const userInfo = await db.getUserAppInfo(userId);
        let newMessage = {
            message: text,
            sender_first: userInfo.rows[0].first,
            sender_last: userInfo.rows[0].last,
            sender_id: userInfo.rows[0].id,
            sender_url: userInfo.rows[0].url
        };
        db.addChatMessage(newMessage.message, newMessage.sender_id).then(dbInfo => {
            newMessage.message_id = dbInfo.rows[0].id;
            newMessage.message_created_at = dbInfo.rows[0].created_at;
            io.sockets.emit('chatMessageFromServer', newMessage);
        }).catch(err => {
            console.log("error while adding new chatmessage: ", err);
        });
    });

    //load friendMessages data flow
    socket.on('showFriendMessagesFromUserInput', friendship_id => {
        db.getFriendMessages(friendship_id).then(results => {
            socket.emit('friendMessages', results.rows);
        }).catch(err => {
            console.log("error while loading friendMessages: ", err);
        });
    });

    //add friendMessage data flow
    socket.on('newFriendMessageFromUserInput', async info => {
        const userInfo = await db.getUserAppInfo(userId);
        let newFriendMessage = {
            message: info.text,
            sender_first: userInfo.rows[0].first,
            sender_last: userInfo.rows[0].last,
            sender_id: userInfo.rows[0].id,
            sender_url: userInfo.rows[0].url,
            friendship_id: info.friendship_id
        };
        db.addFriendMessage(newFriendMessage.message, newFriendMessage.sender_id, newFriendMessage.friendship_id).then(dbInfo => {
            newFriendMessage.message_id = dbInfo.rows[0].id;
            newFriendMessage.message_created_at = dbInfo.rows[0].created_at;
            io.sockets.emit('newFriendMessageFromServer', newFriendMessage);
        }).catch(err => {
            console.log("error while adding new chatmessage: ", err);
        });
    });

    socket.on('reloadFriendMessages', () => {
        socket.emit('reloadFriendMessages');
    });

    socket.on('hideFriendMessages', () => {
        socket.emit('hideFriendMessages');
    });

});
