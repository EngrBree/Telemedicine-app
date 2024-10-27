const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const db = require('./config/db');


// Load environment variables
dotenv.config();

const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Body parser middleware to handle form data and JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session store using MySQL
const sessionStore = new MySQLStore({}, db);

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore, // Storing sessions in MySQL
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: false,   // Set to true if you're using HTTPS
        maxAge: 1000 * 60 * 60,  // 1 hour session expiration
        sameSite: 'lax'  // Cookies sent only for same-site requests
    }
}));

// Import and use routes for patients, doctors, and admins
app.use('/telemedicine/api/patients', require('./routes/patientRoutes'));
app.use('/telemedicine/api/doctors', require('./routes/doctorRoutes.js'));
app.use('/telemedicine/api/auth',require('./routes/authRoutes'))
app.use('/telemedicine/api/admins', require('./routes/adminRoutes'));



// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// Catch-all route to serve frontend (for SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
