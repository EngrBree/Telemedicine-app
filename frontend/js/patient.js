// patient.js

// Register patient
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/telemedicine/api/patients/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = '/login.html'; // Redirect to login page
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Patient login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/telemedicine/api/patients/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Login successful!');
            window.location.href = '/patientProfile.html'; // Redirect to profile page
        } else {
            alert('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// View profile
window.addEventListener('load', async () => {
    if (window.location.pathname === '/patientProfile.html') {
        try {
            const response = await fetch('/telemedicine/api/patients/profile', {
                method: 'GET',
                credentials: 'include' 
            });
            const patientData = await response.json();

            document.querySelector('input[name="first_name"]').value = patientData.first_name;
            document.querySelector('input[name="last_name"]').value = patientData.last_name;
            document.querySelector('input[name="phone"]').value = patientData.phone;
            document.querySelector('input[name="date_of_birth"]').value = patientData.date_of_birth;
            document.querySelector('input[name="gender"]').value = patientData.gender;
            document.querySelector('input[name="address"]').value = patientData.address;
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }
});

// Edit profile
document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/telemedicine/api/patients/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/telemedicine/api/patients/logout', {
            method: 'POST'
        });

        if (response.ok) {
            alert('Logout successful!');
            window.location.href = '/login.html'; // Redirect to login page
        } else {
            alert('Failed to logout.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
