const spicedPg = require("spiced-pg");
// const secrets = require("./secrets");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/socialnetwork"
);


exports.createLogin = (first, last, email, password) => {
  return db.query(
    `INSERT INTO accounts (first,last,email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [first || null, last || null, email || null, password || null]
  );
};


exports.getUser = email => {
    return db.query(
        `SELECT *
         FROM accounts
         WHERE email = $1`,
        [email]
    );
};

exports.uploadProfilePic = (id, profilepic) => {
    return db.query(
         `UPDATE accounts
         SET profilepic = $2
         WHERE id = $1
         RETURNING id, profilepic`,
         [id, profilepic]
    );
};

exports.getUserPic = id => {
    return db.query(
        `SELECT *
         FROM accounts
         WHERE id = $1`,
        [id]
    );
};

exports.uploadBio = (id, bio) => {
    return db.query(
         `UPDATE accounts
         SET bio = $2
         WHERE id = $1
         RETURNING id, bio`,
         [id, bio]
    );
}

exports.getOtherUser = id => {
    return db.query(
        `SELECT id, first, last, profilepic
         FROM accounts
         WHERE id = $1`,
        [id]
    );
}

exports.getStatus = (receiver_id, sender_id) => {
    return db.query(
        `SELECT *
        FROM friendship
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver_id, sender_id]
    );
}

exports.sendInvite = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendship (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING *`,
        [receiver_id, sender_id]
    );
}

exports.sendAccept =  (receiver_id, sender_id)  => {
    return db.query(
        `UPDATE friendship
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver_id, sender_id]
    );
}

exports.sendCancel = (receiver_id, sender_id)  => {
    return db.query(
        `DELETE FROM friendship
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver_id, sender_id]
    );
}

exports.getFriendsAndWannabes = (id) => {
    return db.query(
    `SELECT accounts.id, first, last, profilepic, accepted
    FROM friendship
    JOIN accounts
    ON (accepted = false AND receiver_id = $1 AND sender_id = accounts.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = accounts.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = accounts.id)`,
    [id]
    );
}

exports.getUsersByIds = (arrayOfIds) => {
    const query = `SELECT id, first, last, profilepic FROM accounts WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
}


exports.getUserById = (id) => {
    return db.query(
        `SELECT id, first, last, profilepic FROM accounts WHERE id = $1`,
        [id]
    );
}

exports.getMessages = () => {
    return db.query(
        `SELECT * FROM (
            SELECT messages.id AS message_id, message, ts_messages, first, last, profilepic, accounts.id AS accounts_id
            FROM messages
            LEFT JOIN accounts
            ON messages.user_id = accounts.id
            ORDER BY ts_messages DESC
            LIMIT 10) as subquery
        ORDER BY subquery.ts_messages ASC`)
}


exports.updateMessages = (message, id) => {
    return db.query(
        `INSERT INTO messages (message, user_id)
        VALUES ($1, $2)
        RETURNING id`,
        [message, id]
    )
}

exports.getnewMessage = (id) => {
    return db.query(
        `SELECT messages.id AS message_id, message, first, last, profilepic
        FROM messages
        JOIN accounts
        ON messages.user_id = accounts.id
        WHERE messages.id = $1`,
        [id]
    )
}
