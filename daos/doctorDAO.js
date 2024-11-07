const db = require('../config/db'); // Ensure you have a database connection

// Create a new doctor
const createDoctor = (newDoctor, callback) => {
    const sql = 'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [newDoctor.first_name, newDoctor.last_name, newDoctor.specialization, newDoctor.email, newDoctor.phone, newDoctor.schedule];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error creating doctor:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

// Find a doctor by email
const findDoctorByEmail = (email, callback) => {
    const sql = 'SELECT * FROM doctors WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error finding doctor by email:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

const findDoctorById = (id, callback) => {
    const query = `SELECT * FROM doctors WHERE id = ?`;
    db.query(query, [id], callback);
  };
  

// Update doctor information
const updateDoctor = (id, updatedData, callback) => {
    const sql = 'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?';
    const params = [updatedData.first_name, updatedData.last_name, updatedData.specialization, updatedData.email, updatedData.phone, updatedData.schedule, id];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error updating doctor:', err);
            return callback(err);
        }
        callback(null, results);
    });
};
const getAllDoctors = (callback) => {
    const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM doctors';
    db.query(query, callback);
};

// Export the functions
module.exports = { createDoctor, findDoctorByEmail, findDoctorById, updateDoctor,getAllDoctors };
