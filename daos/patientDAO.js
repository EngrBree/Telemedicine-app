const db = require('../config/db');

const createPatient = (data, callback) => {
  const query = `INSERT INTO patients SET ?`;
  db.query(query, data, callback);
};

const findPatientByEmail = (email, callback) => {
  const query = `SELECT * FROM patients WHERE email = ?`;
  db.query(query, [email], callback);
};

const findPatientById = (id, callback) => {
  const query = `SELECT * FROM patients WHERE id = ?`;
  db.query(query, [id], callback);
};

const updatePatient = (id, data, callback) => {
  const query = `UPDATE patients SET ? WHERE id = ?`;
  db.query(query, [data, id], callback);
};

module.exports = { createPatient, findPatientByEmail, findPatientById, updatePatient };
