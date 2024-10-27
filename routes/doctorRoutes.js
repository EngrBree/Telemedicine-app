const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController'); // Adjust path as necessary

// Doctor registration route
//router.post('/register', doctorController.registerDoctor);

// Doctor login route
//router.post('/login', doctorController.loginDoctor);
router.get('/all',doctorController.getAllDoctors)

// View doctor profile route
router.get('/profile', doctorController.viewProfile);

// Edit doctor profile route
router.put('/profile', doctorController.editProfile); 

// Get doctor by ID (accessible by patient, doctor, or admin)
router.get('/doctor/:id', doctorController.getDoctorById);

// Delete doctor by ID (only accessible by admin)
router.delete('/doctor/:id', doctorController.deleteDoctorById);

// Dashboard route for doctors (you can create a separate controller for dashboard logic if needed)
router.get('/dashboard', (req, res) => {
    
    res.sendFile('frontend/doctorProfile.html'); // Replace with actual dashboard rendering
});


module.exports = router;
