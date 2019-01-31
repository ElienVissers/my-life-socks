DROP TABLE IF EXISTS profile_pictures;

CREATE TABLE profile_pictures(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    user_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
