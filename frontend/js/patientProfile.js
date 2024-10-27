// Mock user session data - In real implementation, this data would be retrieved from the session or API
const userSession = {
    firstName: 'John',
    userId: 123
};

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set user's first name in the welcome message
    document.getElementById('userFirstName').textContent = userSession.firstName;

    // Event listeners for profile actions
    document.getElementById('viewProfile').addEventListener('click', function () {
        window.location.href = '/patient/profile';
    });

    document.getElementById('editProfile').addEventListener('click', function () {
        window.location.href = '/patient/profile/edit';
    });

    document.getElementById('logout').addEventListener('click', function () {
        // Logout logic (can involve clearing the session or sending a request to log out)
        window.location.href = '/logout';
    });

    // Fetch appointments data (use real API call in practice)
    fetchAppointments();

    // Add appointment button listener
    document.getElementById('addAppointmentBtn').addEventListener('click', function () {
        window.location.href = '/patient/appointments/schedule';
    });
});

// Fetch appointments from the backend (mocking here for the example)
function fetchAppointments() {
    // Mock API call
    const appointments = [
        {
            doctor_name: 'Dr. Smith',
            appointment_date: '2024-11-01',
            appointment_time: '10:00 AM',
            status: 'Scheduled',
            appointment_id: 1
        },
        {
            doctor_name: 'Dr. Brown',
            appointment_date: '2024-11-05',
            appointment_time: '2:00 PM',
            status: 'Completed',
            appointment_id: 2
        }
    ];

    const appointmentsTableBody = document.getElementById('appointmentsTable').querySelector('tbody');
    const noAppointmentsMessage = document.getElementById('noAppointmentsMessage');

    // Clear existing rows
    appointmentsTableBody.innerHTML = '';

    if (appointments.length === 0) {
        noAppointmentsMessage.style.display = 'block';
    } else {
        noAppointmentsMessage.style.display = 'none';
        appointments.forEach(appointment => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${appointment.doctor_name}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="edit-btn" onclick="editAppointment(${appointment.appointment_id})">Edit</button>
                    <button class="delete-btn" onclick="deleteAppointment(${appointment.appointment_id})">Delete</button>
                </td>
            `;

            appointmentsTableBody.appendChild(row);
        });
    }
}

// Edit appointment logic
function editAppointment(appointmentId) {
    window.location.href = `/patient/appointments/edit/${appointmentId}`;
}

// Delete appointment logic
function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        // Mock deletion - In real use case, send a DELETE request to the server
        console.log('Deleting appointment:', appointmentId);

        // After deletion, refetch appointments or remove the row
        fetchAppointments();  // You can call the API again or remove the row from the table
    }
}
