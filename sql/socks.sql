DROP TABLE IF EXISTS socks;

CREATE TABLE socks(
    id SERIAL PRIMARY KEY,
    color VARCHAR(50) NOT NULL,
    shape VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);