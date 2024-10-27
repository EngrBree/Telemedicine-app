const express = require('express');
const router = express.Router(); 
const bcrypt =require('bcrypt')
const adminController=require('../controllers/adminController');
const db=require('../config/db')

router.post('/register',adminController.createAdmin)
router.get('/dashboard', async (req, res) => {
    try {
        // Use db.query without destructuring
        db.query('SELECT COUNT(*) as total_doctors FROM doctors', (err, doctorsResult) => {
            if (err) throw err;

            db.query('SELECT COUNT(*) as total_patients FROM patients', (err, patientsResult) => {
                if (err) throw err;

                db.query('SELECT COUNT(*) as total_appointments FROM appointments', (err, appointmentsResult) => {
                    if (err) throw err;

                    // Access the first row in each result to get the counts
                    const totalDoctors = doctorsResult[0].total_doctors;
                    const totalPatients = patientsResult[0].total_patients;
                    const totalAppointments = appointmentsResult[0].total_appointments;

                    // Send the JSON response
                    res.json({
                        doctors: totalDoctors,
                        patients: totalPatients,
                        appointments: totalAppointments,
                        username: req.session.username  // Assuming session is properly configured
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/patientdash', async (req, res) => {
    try {
        const { search = '', filter = 'all', gender = 'all' } = req.query;  // Get search, filter, and gender options from query params

        // Basic query to fetch all patients
        let query = 'SELECT * FROM patients WHERE 1=1';

        // Add search functionality for first name or last name
        if (search) {
            query += ` AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%')`;
        }

        

        // Add filtering based on gender
        if (gender !== 'all') {
            query += ` AND gender = '${gender}'`;
        }

        // Execute the query
        db.query(query, (err, results) => {
            if (err) throw err;
            res.json(results);  // Send the patient data as a JSON response
        });
    } catch (error) {
        console.error('Error fetching patient data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/doctordash', async (req, res) => {
    try {
        const { first_name, last_name, specialization, email, phone, schedule, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Validate and parse schedule as JSON
        const parsedSchedule = JSON.stringify(schedule);

        // Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) throw err;

            // Insert doctor into the doctors table
            const doctorQuery = 'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const doctorValues = [first_name, last_name, specialization, email, phone, parsedSchedule, password_hash];

            db.query(doctorQuery, doctorValues, (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        throw err;
                    });
                }

                // Get the doctorId for future use (if needed)
                const doctorId = result.insertId;

                // Insert the user's credentials into the users table
                const userQuery = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)';
                const userValues = [email, password_hash, 'doctor']; // Assuming 'doctor' is the role for doctors

                db.query(userQuery, userValues, (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            throw err;
                        });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                throw err;
                            });
                        }

                        res.json({ message: 'Doctor added successfully', doctorId });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error adding new doctor:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/doctorsearch', async (req, res) => {
    try {
        const { search = '', specialization = '' } = req.query;  // Get search and specialization from query params

        // Basic query to fetch all doctors
        let query = 'SELECT * FROM doctors WHERE 1=1';

        // Add search functionality for first name or last name
        if (search) {
            query += ` AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%')`;
        }

        // Add filtering based on specialization
        if (specialization) {
            query += ` AND specialization LIKE '%${specialization}%'`;
        }

        // Execute the query
        db.query(query, (err, results) => {
            if (err) throw err;
            res.json(results);  // Send the doctor data as a JSON response
        });
    } catch (error) {
        console.error('Error fetching doctor data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports=router;