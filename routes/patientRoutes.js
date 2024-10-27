const express = require('express');
const patientController = require('../controllers/patientController');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware.js')
const db=require('../config/db.js')


// Register route
router.post('/register', patientController.registerPatient);

// Login route
//router.post('/login', patientController.loginPatient);

// Profile routes
router.get('/profile', patientController.viewProfile);
router.post('/edit-profile', patientController.editProfile);
router.post('/appointments/schedule', patientController.scheduleAppointment);

// Route to get all appointments for the logged-in patient
router.get('/appointments', patientController.getPatientAppointments);


router.post('/createSchedule', (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
  
    // Insert appointment data into the Appointments table
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(query, [patient_id, doctor_id, appointment_date, appointment_time, status || 'scheduled'], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating appointment schedule' });
      }
      res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
    });
  });
  
  // Get all appointment schedules
  router.get('/schedules', (req, res) => {
    const query = `
        SELECT appointments.appointment_date, appointments.appointment_time, 
               appointments.status, CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctor_name
        FROM appointments
        JOIN doctors ON appointments.doctor_id = doctors.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching schedules' });
        }
        res.status(200).json(results);
    });
});


router.get('/dashboard',isAuthenticated, (req, res) => {
    console.log(req.session.user);
    
    res.sendFile('frontend/patientProfile.html'); // Replace with actual dashboard rendering
});


module.exports = router;
