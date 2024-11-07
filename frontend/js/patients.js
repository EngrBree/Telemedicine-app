// Get references to DOM elements
const appointmentsList = document.getElementById('appointments-list');
const showAppointmentsBtn = document.getElementById('show-appointments-btn');
const addAppointmentBtn = document.getElementById('add-appointment-btn');
const appointmentModal = document.getElementById('appointment-modal');
const closeAppointmentModal = document.getElementById('close-modal');
const profileModal = document.getElementById('profile-modal');
const profileBtn = document.getElementById('profile-btn');
const closeProfileModal = document.getElementById('close-profile-modal');
const mapContainer = document.getElementById('hospitalMap');
const noDataMessage = document.querySelector('.no-data-message');

// Toggle appointments list visibility
let appointmentsVisible = false;
showAppointmentsBtn.addEventListener('click', () => {
    appointmentsVisible = !appointmentsVisible;
    appointmentsList.style.display = appointmentsVisible ? 'table' : 'none';
    noDataMessage.style.display = appointmentsVisible && appointmentsList.rows.length === 0 ? 'block' : 'none';
});

// Show and hide appointment modal
addAppointmentBtn.addEventListener('click', () => {
    appointmentModal.style.display = 'flex';
});

closeAppointmentModal.addEventListener('click', () => {
    appointmentModal.style.display = 'none';
});

// Show and hide profile modal
profileBtn.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

closeProfileModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Close modals when clicking outside of them
window.addEventListener('click', (event) => {
    if (event.target === appointmentModal) {
        appointmentModal.style.display = 'none';
    }
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

// Handle form submission for adding an appointment
document.getElementById('appointment-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const doctor = document.getElementById('doctor-select').value;
    
    // Add a new row to the appointments list table
    const newRow = appointmentsList.insertRow();
    newRow.innerHTML = `
        <td>${date}</td>
        <td>${time}</td>
        <td>${doctor}</td>
        <td><button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button></td>
    `;
    
    // Hide modal after adding
    appointmentModal.style.display = 'none';
});

// Initialize map to show nearby hospitals based on user's location
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = [position.coords.latitude, position.coords.longitude];
            
            // Create and display the map
            const map = L.map(mapContainer).setView(userLocation, 13);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add marker for user location
            L.marker(userLocation).addTo(map)
                .bindPopup("You are here")
                .openPopup();
            
            // Add hospital markers here (example coordinates, replace with real data)
            const hospitals = [
                { name: "City Hospital", coords: [position.coords.latitude + 0.01, position.coords.longitude + 0.01] },
                { name: "County Medical Center", coords: [position.coords.latitude - 0.01, position.coords.longitude - 0.01] }
            ];
            
            hospitals.forEach(hospital => {
                L.marker(hospital.coords).addTo(map)
                    .bindPopup(hospital.name);
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Load map when the page loads
window.addEventListener('load', initMap);
