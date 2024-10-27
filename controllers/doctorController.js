const bcrypt = require('bcrypt');
const doctorDAO = require('../daos/doctorDAO');
const userDAO = require('../daos/userDAO'); // Import the userDAO to manage users


// View Doctor Profile
const viewProfile = (req, res) => {
    console.log(req.session)
    // Check if the user session exists and contains the doctor ID
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    const doctorId = req.session.user.id;

    // Fetch doctor details from the database using doctorDAO
    doctorDAO.findDoctorById(doctorId, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving doctor profile' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Send doctor details as a JSON response
        res.json(results[0]);
    });
};

// Edit Profile
const editProfile = (req, res) => {
    // Check if user is logged in and has role 'doctor'
    if (!req.session.user || req.session.user.role !== 'doctor') {
        return res.status(403).send('Unauthorized access');
    }

    const userId = req.session.user.id;
    const updatedData = req.body;

    doctorDAO.updateDoctor(userId, updatedData, (err, results) => {
        if (err) throw err;
        res.redirect('/doctor/profile'); // Redirect to profile after editing
    });
};
const getAllDoctors = (req, res) => {
    console.log('Session:', req.session);
    if (!req.session.user || req.session.user.role !== 'patient') {
        console.log('Unauthorized access: session not found or invalid role');
        return res.status(403).send('Unauthorized access');
    }

    doctorDAO.getAllDoctors((err, doctors) => {
        if (err) {
            console.log('Error fetching doctors:', err);
            return res.status(500).send('Error fetching doctors');
        }
        res.json(doctors);
    });
};
const getDoctorById = (req, res) => {
    console.log('Session:', req.session);
    
    // Allow access if the user is a patient, doctor, or admin
    if (!req.session.user || !['patient', 'doctor', 'admin'].includes(req.session.user.role)) {
        console.log('Unauthorized access: session not found or invalid role');
        return res.status(403).send('Unauthorized access');
    }

    const doctorId = req.params.id;

    doctorDAO.getDoctorById(doctorId, (err, doctor) => {
        if (err) {
            console.log('Error fetching doctor:', err);
            return res.status(500).send('Error fetching doctor');
        }

        if (!doctor) {
            console.log('Doctor not found:', doctorId);
            return res.status(404).send('Doctor not found');
        }

        res.json(doctor);
    });
};
const deleteDoctorById = (req, res) => {
    console.log('Session:', req.session);
    
    // Only allow users with 'admin' role to delete doctors
    if (!req.session.user || req.session.user.role !== 'admin') {
        console.log('Unauthorized access: session not found or invalid role');
        return res.status(403).send('Unauthorized access');
    }

    const doctorId = req.params.id;

    doctorDAO.deleteDoctorById(doctorId, (err, result) => {
        if (err) {
            console.log('Error deleting doctor:', err);
            return res.status(500).send('Error deleting doctor');
        }

        if (result.affectedRows === 0) {
            console.log('Doctor not found for deletion:', doctorId);
            return res.status(404).send('Doctor not found');
        }

        res.send('Doctor deleted successfully');
    });
};




module.exports = {  viewProfile, editProfile,getAllDoctors,getDoctorById,deleteDoctorById };
