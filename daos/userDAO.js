const db = require('../config/db'); // Ensure you have a database connection

// Create a new user
const createUser = (newUser, callback) => {
    const sql = 'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)';
    const params = [
        newUser.email || null,  // If email is not provided (e.g., for admins), insert null
        newUser.username || null,  // If username is not provided (e.g., for patients), insert null
        newUser.password_hash,
        newUser.role
    ];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error creating user:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

// Find a user by email (used for patients and doctors)
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) {
                console.error('Error finding user by email:', err);
                return reject(err);
            }
            resolve(results[0]); // Assuming you're only looking for the first match
        });
    });
};

// Find an admin by username
const findAdminByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?'; // Now querying from users table
        db.query(sql, [username], (err, results) => {
            if (err) {
                console.error('Error finding admin by username:', err);
                return reject(err);
            }
            resolve(results[0]); // Assuming you're only looking for the first match
        });
    });
};

// Export the functions
module.exports = { createUser, findUserByEmail, findAdminByUsername };
