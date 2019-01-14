DROP TABLE IF EXISTS accounts;


CREATE TABLE accounts(
    id SERIAL PRIMARY KEY,
    first TEXT NOT NULL,
    last TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(200) NOT NULL,
    profilepic VARCHAR(300),
    bio TEXT,
    ts_accounts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
