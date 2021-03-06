DROP TABLE IF EXISTS chatmessages;

CREATE TABLE chatmessages(
    id SERIAL PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
