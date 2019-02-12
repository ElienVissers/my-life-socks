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
        `SELECT users.first AS first, users.last AS last, users.id AS id, profile_pictures.url AS url, bios.bio AS bio, socks.color AS color, socks.shape AS shape
        FROM users
        LEFT JOIN profile_pictures
        ON users.id = profile_pictures.user_id
        LEFT JOIN bios
        ON users.id = bios.user_id
        LEFT JOIN socks
        ON users.id = socks.user_id
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

module.exports.updateSocks = function(color, shape, user_id) {
    return db.query(
        `INSERT INTO socks (color, shape, user_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id)
        DO UPDATE SET color = $1, shape = $2
        RETURNING color, shape`,
        [color, shape, user_id]
    );
};

module.exports.getFriendshipStatus = function(user_id, otheruser_id) {
    return db.query(
        `SELECT *
        FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [user_id, otheruser_id]
    );
};

module.exports.addFriendship = function(user_id, otheruser_id) {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)`,
        [user_id, otheruser_id]
    );
};

module.exports.removeFriendship = function(user_id, otheruser_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [user_id, otheruser_id]
    );
};

module.exports.updateFriendship = function(user_id, otheruser_id) {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)`,
        [user_id, otheruser_id]
    );
};

module.exports.getFriendshipLists = function(id) {
    return db.query(
        `SELECT users.id, first, last, url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        LEFT JOIN profile_pictures
        ON users.id = profile_pictures.user_id`,
        [id]
    );
};

module.exports.getUsersByIds = function(arrayOfIds) {
    return db.query(
        `SELECT users.id AS id, first, last, url
        FROM users
        LEFT JOIN profile_pictures
        ON users.id = profile_pictures.user_id
        WHERE users.id = ANY($1)`,
        [arrayOfIds]
    );
};

module.exports.getChatMessages = function() {
    return db.query(
        `SELECT users.id AS sender_id, users.first AS sender_first, users.last AS sender_last, profile_pictures.url AS sender_url, message, chatmessages.id AS message_id, chatmessages.created_at AS message_created_at
        FROM chatmessages
        LEFT JOIN users
        ON chatmessages.user_id = users.id
        LEFT JOIN profile_pictures
        ON chatmessages.user_id = profile_pictures.user_id
        ORDER BY chatmessages.created_at DESC
        LIMIT 10`
    );
};

module.exports.addChatMessage = function(message, user_id) {
    return db.query(
        `INSERT INTO chatmessages (message, user_id)
        VALUES ($1, $2)`,
        [message, user_id]
    );
};
