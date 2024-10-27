const bcrypt = require('bcrypt');
const patientDAO = require('../daos/patientDAO');
const path = require('path'); // Import path module
const appointmentDAO = require('../daos/appointmentDAO'); 
const userDAO=require('../daos/userDAO')

// Registration logic
const registerPatient = (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
  
  patientDAO.findPatientByEmail(email, (err, results) => {
    if (results.length > 0) {
      return res.status(400).send('Email already exists');
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      
      const newUser = { email, password_hash: hash, role: 'patient' };
      userDAO.createUser(newUser, (err, results) => {
        if (err) throw err;

        const patientId = results.insertId; 


      const newPatient = {id:patientId, first_name, last_name, email, password_hash: hash, phone, date_of_birth, gender, address };
      patientDAO.createPatient(newPatient, (err, results) => {
        if (err) throw err;
        res.redirect('/login'); // Redirect to login after registration
      });
    });
    });
  });
};



// View Profile
const viewProfile = (req, res) => {
    console.log('Session ID: ', req.sessionID);
    const userId = req.session.user.id;
    
    patientDAO.findPatientById(userId, (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      const patient = results[0];
      // Respond with JSON instead of sending an HTML file
      res.json(patient);
    });
  };
  

// Edit Profile
const editProfile = (req, res) => {
  const userId = req.session.user.id;
  const updatedData = req.body;
  
  patientDAO.updatePatient(userId, updatedData, (err, results) => {
    if (err) throw err;
    res.redirect('/profile'); // Redirect to profile after editing
  });
};

// Schedule an appointment by a patient
const scheduleAppointment = (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;
  const patient_id = req.session.user.id; // Assuming the patient's ID is stored in the session after login

  const newAppointment = {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status: 'scheduled'
  };

  appointmentDAO.createAppointment(newAppointment, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error scheduling appointment' });
      }
      res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: results.insertId });
  });
};

// Get all appointments for the logged-in patient
const getPatientAppointments = (req, res) => {
  const patient_id = req.session.user.id; // Assuming the patient's ID is stored in the session after login

  appointmentDAO.findAppointmentsByPatient(patient_id, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching appointments' });
      }
      res.json(results);
  });
};




module.exports = { registerPatient, viewProfile, editProfile,scheduleAppointment, getPatientAppointments  };
