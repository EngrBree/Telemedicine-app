const db = require('../config/db'); // Ensure you have a MySQL connection configured
const bcrypt = require('bcrypt');

// Create a new user (for admin, doctor, etc.)
const createAdmin = async (username, password, role) => {
    try {
        const password_hash = await bcrypt.hash(password, 10); // Hash the password

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO admin (username , password_hash, role) VALUES (?, ?, ?)';
            db.query(sql, [username, password_hash, role], (err, results) => {
                if (err) {
                    console.error('Error creating new user:', err);
                    return reject(err);
                }
                resolve(results.insertId); // Return the ID of the newly created user
            });
        });
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const findUserByIdentifier = (identifier) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admin WHERE (username = ?)';
        db.query(sql, [identifier, identifier], (err, results) => {
            if (err) {
                console.error('Error finding user:', err);
                return reject(err);
            }
            resolve(results[0]); // Return the first matched result
        });
    });
};

// Export DAO functions
module.exports = {
    createAdmin,
    findUserByIdentifier
   
};
