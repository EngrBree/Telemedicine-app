const db = require('../config/db');

// Create a new appointment
const createAppointment = (appointmentData, callback) => {
    const query = `INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) 
                   VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [
        appointmentData.patient_id,
        appointmentData.doctor_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time,
        appointmentData.status
    ], callback);
};

// Get appointments by doctor ID
const findAppointmentsByDoctor = (doctor_id, callback) => {
    const query = `SELECT * FROM Appointments WHERE doctor_id = ?`;
    db.query(query, [doctor_id], callback);
};

// Get appointments by patient ID
const findAppointmentsByPatient = (patient_id, callback) => {
    const query = `SELECT * FROM Appointments WHERE patient_id = ?`;
    db.query(query, [patient_id], callback);
};

// Update an appointment status
const updateAppointmentStatus = (appointment_id, status, callback) => {
    const query = `UPDATE Appointments SET status = ? WHERE id = ?`;
    db.query(query, [status, appointment_id], callback);
};

// Cancel an appointment
const cancelAppointment = (appointment_id, callback) => {
    const query = `UPDATE Appointments SET status = 'canceled' WHERE id = ?`;
    db.query(query, [appointment_id], callback);
};

module.exports = {
    createAppointment,
    findAppointmentsByDoctor,
    findAppointmentsByPatient,
    updateAppointmentStatus,
    cancelAppointment
};
