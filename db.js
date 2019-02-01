const spicedPg = require('spiced-pg');
var db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {dbUser, dbPassword} = require('./secrets');
    db = spicedPg(`postgres:${dbUser}:${dbPassword}@localhost:5432/socialnetwork`);
}


module.exports.registerUser = function(first, last, email, hashedpass) {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [first, last, email, hashedpass]
    );
};

module.exports.getUserInfo = function(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.getUserAppInfo = function(user_id) {
    return db.query(
        `SELECT users.first AS first, users.last AS last, users.id AS id, profile_pictures.url AS url
        FROM users
        LEFT JOIN profile_pictures
        ON users.id = profile_pictures.user_id
        WHERE users.id = $1`,
        [user_id]
    );
};

module.exports.addImage = function(url, user_id) {
    return db.query(
        `INSERT INTO profile_pictures (url, user_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET url = $1
        RETURNING url`,
        [url, user_id]
    );
};

module.exports.checkBioExistance = function(user_id) {
    return db.query(
        `SELECT bios.bio AS bio
        FROM users
        LEFT JOIN bios
        ON users.id = bios.user_id
        WHERE users.id = $1`,
        [user_id]
    );
};

module.exports.updateBio = function(user_id, bio) {
    return db.query(
        `INSERT INTO bios (bio, user_id)
        VALUES ($2, $1)
        ON CONFLICT (user_id)
        DO UPDATE SET bio = $2
        RETURNING bio`,
        [user_id, bio]
    );
};
