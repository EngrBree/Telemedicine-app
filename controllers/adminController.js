const bcrypt = require('bcrypt');
const validator = require('validator');
const adminDAO = require('../daos/adminDAO');
const userDAO = require('../daos/userDAO');

const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Ensure username is not an email
    if (validator.isEmail(username)) {
        return res.status(400).json({ message: 'Username cannot be an email' });
    }

    // Password validation
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if admin with the same username exists
        const existingAdmin = await adminDAO.findUserByIdentifier(username);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this username already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create a new admin user in the 'users' table
        const newUser = { username, password_hash, role: 'admin' }; // Email is used for username in this case
        userDAO.createUser(newUser, (err, results) => {
            if (err) {
                console.error('Error creating user in users table:', err);
                return res.status(500).json({ message: 'Error creating admin user' });
            }

            //const adminId = results.insertId; // Get the inserted admin user ID from users table

            // Insert into the admin table
            const newAdmin = { username, password_hash, role: 'admin' };
            adminDAO.createAdmin(newAdmin, (err, results) => {
                if (err) {
                    console.error('Error creating admin record:', err);
                    return res.status(500).json({ message: 'Error creating admin record' });
                }

                return res.status(201).json({ message: 'Admin registered successfully', adminId });
            });
        });
    } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createAdmin };
