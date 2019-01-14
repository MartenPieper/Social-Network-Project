DROP TABLE IF EXISTS friendship;

CREATE TABLE friendship(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES accounts(id),
    sender_id INTEGER NOT NULL REFERENCES accounts(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
