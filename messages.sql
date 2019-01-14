DROP TABLE IF EXISTS messages;


CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    user_id INTEGER REFERENCES accounts(id),
    ts_messages TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
