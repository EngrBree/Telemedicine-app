// frontend/js/doctor.js

document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
    fetchAppointments();
    
    document.getElementById('logout').addEventListener('click', logout);
});

// Function to fetch doctor profile
function fetchProfile() {
    fetch('/telemedicine/api/doctors/profile', {
        method: 'GET',
        credentials: 'include' // To include cookies for session management
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    })
    .then(data => {
        const profileDiv = document.getElementById('profile');
        profileDiv.innerHTML = `
            <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Specialization:</strong> ${data.specialization}</p>
            <p><strong>Schedule:</strong> ${JSON.stringify(data.schedule)}</p>
            <button onclick="editProfile()">Edit Profile</button>
        `;
    })
    .catch(err => {
        console.error(err);
    });
}

// Function to fetch doctor appointments
function fetchAppointments() {
    fetch('/telemedicine/api/doctors/appointments', {
        method: 'GET',
        credentials: 'include' // To include cookies for session management
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return response.json();
    })
    .then(data => {
        const appointmentsDiv = document.getElementById('appointments');
        appointmentsDiv.innerHTML = data.map(appointment => `
            <div>
                <p><strong>Patient:</strong> ${appointment.patient_name}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>
            </div>
        `).join('');
    })
    .catch(err => {
        console.error(err);
    });
}

// Function to log out
function logout() {
    fetch('/telemedicine/api/doctors/logout', {
        method: 'POST',
        credentials: 'include' // To include cookies for session management
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'index.html'; // Redirect to home after logout
        }
    })
    .catch(err => {
        console.error(err);
    });
}

// Function to edit profile (you can implement the logic)
function editProfile() {
    // Here you can show a form to edit the profile or redirect to an edit page
    alert("Edit profile feature is not implemented yet.");
}
