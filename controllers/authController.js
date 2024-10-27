const bcrypt = require('bcrypt');
const userDAO = require('../daos/userDAO'); // Assuming you will modify this DAO to handle both cases

// Helper function to validate if the identifier is an email
function validateEmail(identifier) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
}

module.exports = {
    loginUser: async (req, res) => {
        const { identifier, password } = req.body; // 'identifier' can be either email or username
        
        try {
            let user;

            // Check if the identifier is an email (for doctors/patients) or a username (for admins)
            if (validateEmail(identifier)) {
                // Fetch doctor/patient by email
                user = await userDAO.findUserByEmail(identifier);
            } else {
                // Fetch admin by username
                user = await userDAO.findAdminByUsername(identifier);
            }

            if (!user) {
                return res.status(401).json({ message: 'Invalid email/username or password' });
            }
            console.log('Fetched user password hash:', user.password_hash);


            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash); 
            if (!isPasswordValid) {
                console.log('Password mismatch:', password, user.password_hash);

                return res.status(401).json({ message: 'Wrong password' });
            }

            // Set user session or JWT token
            req.session.user = { id: user.id, role: user.role };

            // Redirect to respective dashboard based on role
            if (user.role === 'doctor') {
                return res.json({ redirectUrl: '/doctorProfile.html' });
            } else if (user.role === 'patient') {
                return res.json({ redirectUrl: '/patientProfile.html' });
            } else if (user.role === 'admin') {
                return res.json({ redirectUrl: '/adminProfile.html' });
            } else {
                return res.status(400).json({ message: 'Unknown role' });
            }

        } catch (error) {
            console.error('Login Error: ', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};
