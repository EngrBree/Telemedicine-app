const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path as necessary
const Doctor = require('../daos/doctorDAO'); // Adjust path as necessary

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.doctorId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

// GET Doctor Profile
router.get('/profile', (req, res) => {
  const userId = req.session.user && req.session.user.id;
  console.log("Session data:", req.session);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const query = `
      SELECT doctors.* 
      FROM doctors 
      JOIN users ON doctors.user_id = users.id 
      WHERE users.id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(results[0]);
  });
});

// Dashboard route for doctors
router.get('/dashboard', (req, res) => {
  res.sendFile('frontend/doctorProfile.html'); // Replace with actual dashboard rendering
});

// GET Schedule for Doctor
router.get('/schedule', (req, res) => {
  const userId = req.session.user && req.session.user.id;

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  const query = `
      SELECT doctor_schedules.day_of_week, doctor_schedules.start_time, doctor_schedules.end_time, doctor_schedules.id
      FROM doctor_schedules
      JOIN doctors ON doctor_schedules.doctor_id = doctors.id
      WHERE doctors.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.json({ success: true, data: results });
  });
});

// POST Add Schedule for Doctor
router.post('/createSchedule', (req, res) => {
  const user = req.session.user;

  // Check if user is available in session
  if (!user || !user.id) {
    console.error('User ID not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = user.id;
  const { day_of_week, start_time, end_time } = req.body;

  if (!day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Step 1: Retrieve doctor_id using user_id from session
  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [userId], (err, doctorResult) => {
    if (err) {
      console.error('Error fetching doctor ID:', err);
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    if (doctorResult.length === 0) {
      console.error('Doctor not found for userId:', userId); // More specific logging
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorId = doctorResult[0].id;

    // Step 2: Insert the schedule with the retrieved doctor_id
    const insertScheduleQuery = `
      INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time) 
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertScheduleQuery, [doctorId, day_of_week, start_time, end_time], (err, result) => {
      if (err) {
        console.error('Error adding schedule:', err);
        return res.status(500).json({ message: 'Error adding schedule' });
      }

      res.status(201).json({ success: true, message: 'Schedule added', scheduleId: result.insertId });
    });
  });
});



// Route to edit a schedule
router.put('/editSchedule/:scheduleId', (req, res) => {
  const user = req.session.user;

  // Check if user is available in session
  if (!user || !user.id) {
    console.error('User ID not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = user.id;
  const { scheduleId } = req.params;
  const { day_of_week, start_time, end_time } = req.body;

  if (!day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Step 1: Retrieve doctor_id using user_id from session
  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [userId], (err, doctorResult) => {
    if (err) {
      console.error('Error fetching doctor ID:', err);
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    if (doctorResult.length === 0) {
      console.error('Doctor not found for userId:', userId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorId = doctorResult[0].id;

    // Step 2: Update the schedule with the provided information
    const updateScheduleQuery = `
      UPDATE doctor_schedules 
      SET day_of_week = ?, start_time = ?, end_time = ?
      WHERE id = ? AND doctor_id = ?
    `;
    db.query(updateScheduleQuery, [day_of_week, start_time, end_time, scheduleId, doctorId], (err, result) => {
      if (err) {
        console.error('Error updating schedule:', err);
        return res.status(500).json({ message: 'Error updating schedule' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Schedule not found or unauthorized' });
      }

      res.status(200).json({ success: true, message: 'Schedule updated successfully' });
    });
  });
});


// Route to delete a schedule
router.delete('/deleteSchedule/:scheduleId', (req, res) => {
  const user = req.session.user;

  // Check if user is available in session
  if (!user || !user.id) {
    console.error('User ID not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = user.id;
  const { scheduleId } = req.params;

  // Step 1: Retrieve doctor_id using user_id from session
  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [userId], (err, doctorResult) => {
    if (err) {
      console.error('Error fetching doctor ID:', err);
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    if (doctorResult.length === 0) {
      console.error('Doctor not found for userId:', userId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorId = doctorResult[0].id;

    // Step 2: Delete the schedule with the specified ID
    const deleteScheduleQuery = `
      DELETE FROM doctor_schedules WHERE id = ? AND doctor_id = ?
    `;
    db.query(deleteScheduleQuery, [scheduleId, doctorId], (err, result) => {
      if (err) {
        console.error('Error deleting schedule:', err);
        return res.status(500).json({ message: 'Error deleting schedule' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Schedule not found or unauthorized' });
      }

      res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    });
  });
});





router.get('/appointments', (req, res) => {
  const user = req.session.user;
  
  // Check if user is available in session
  if (!user || !user.id) {
    console.error('User ID not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = user.id;
  console.log('Session userId:', userId); // Debugging output

  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [userId], (err, doctorResult) => {
    if (err) {
      console.error('Error fetching doctor ID:', err);
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    if (doctorResult.length === 0) {
      console.error('Doctor not found for userId:', userId); // More specific logging
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const doctorId = doctorResult[0].id;
    console.log('Retrieved doctorId:', doctorId); // Debugging output

    // Update the query to join with patients table to get patient names
    const getAppointmentsQuery = `
      SELECT 
        appointments.id AS appointment_id,
        appointments.appointment_date,
        appointments.status,
        CONCAT(patients.first_name, ' ', patients.last_name) AS patient_name
      FROM 
        appointments
      JOIN 
        patients ON appointments.patient_id = patients.id
      WHERE 
        appointments.doctor_id = ?`;

    db.query(getAppointmentsQuery, [doctorId], (err, appointmentsResult) => {
      if (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ message: 'Error retrieving appointments' });
      }

      res.status(200).json({ success: true, data: appointmentsResult });
    });
  });
});


// Endpoint to reschedule an appointment
// Endpoint to reschedule an appointment
router.put('/appointments/reschedule/:appointmentId', (req, res) => {
  const user = req.session.user;

  if (!user || !user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { appointment_datetime } = req.body;

  if (!appointment_datetime) {
    return res.status(400).json({ message: 'New appointment date and time is required' });
  }

  const [appointment_date, appointment_time] = appointment_datetime.split("T");

  if (!appointment_date || !appointment_time) {
    return res.status(400).json({ message: 'Invalid appointment date and time format' });
  }

  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [user.id], (err, doctorResult) => {
    if (err || doctorResult.length === 0) {
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    const doctorId = doctorResult[0].id;
    const appointmentId = req.params.appointmentId;

    const rescheduleQuery = `
      UPDATE appointments 
      SET appointment_date = ?, appointment_time = ? 
      WHERE id = ? AND doctor_id = ?`;

    db.query(rescheduleQuery, [appointment_date, appointment_time, appointmentId, doctorId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error rescheduling appointment' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found or access denied' });
      }

      res.status(200).json({ message: 'Appointment rescheduled successfully' });
    });
  });
});

// Endpoint to delete an appointment
router.delete('/appointments/:appointment_id', (req, res) => {
  const user = req.session.user;
  
  // Check if user is authenticated
  if (!user || !user.id) {
    console.error('User ID not found in session');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { appointment_id } = req.params;

  if (!appointment_id) {
    return res.status(400).json({ message: 'Appointment ID is required' });
  }

  // Verify that the doctor has access to this appointment
  const getDoctorIdQuery = `SELECT id FROM doctors WHERE user_id = ?`;
  db.query(getDoctorIdQuery, [user.id], (err, doctorResult) => {
    if (err || doctorResult.length === 0) {
      console.error('Error fetching doctor ID:', err);
      return res.status(500).json({ message: 'Error retrieving doctor information' });
    }

    const doctorId = doctorResult[0].id;

    const deleteQuery = `
      DELETE FROM appointments 
      WHERE id = ? AND doctor_id = ?`;

    db.query(deleteQuery, [appointment_id, doctorId], (err, result) => {
      if (err) {
        console.error('Error deleting appointment:', err);
        return res.status(500).json({ message: 'Error deleting appointment' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Appointment not found or access denied' });
      }

      res.status(200).json({ message: 'Appointment deleted successfully' });
    });
  });
});



module.exports = router;
