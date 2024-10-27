document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check if email or password fields are empty
        if (!email || !password) {
            document.getElementById('error').textContent = 'Please enter both email and password';
            return;
        }

        // Create the data object
        const data = {
            email: email,
            password: password
        };

        // Send a POST request to the server
        fetch('/telemedicine/api/doctors/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            // Successful login, redirect based on role
            if (data.role === 'doctor') {
                window.location.href = 'doctor.html'; // Redirect to doctor dashboard
            } else if (data.role === 'patient') {
                window.location.href = 'patientProfile.html'; // Redirect to patient dashboard
            } else {
                document.getElementById('error').textContent = 'Unauthorized access';
            }
        })
        .catch(error => {
            document.getElementById('error').textContent = error.message; // Show error message
        });
    });
});
