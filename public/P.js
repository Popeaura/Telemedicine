document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display patient data
    fetchPatientData();

    // Add event listeners
    document.querySelector('.logout').addEventListener('click', logout);
    document.querySelector('.update-button').addEventListener('click', updatePatientInfo);
    document.querySelector('.add-prescription').addEventListener('click', addPrescription);
    document.querySelector('.notifications').addEventListener('click', fetchNotifications);

    // Setup sidebar
    setupSidebar();
});

async function fetchPatientData() {
    try {
        const response = await fetch('http://localhost:3000/patient-data', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load patient data. Please try again later.');
    }
}

function updateDashboard(data) {
    // Update patient info
    document.querySelector('.patient-card h2').textContent = data.name;
    document.querySelector('.patient-card p').textContent = `Age: ${data.age}`;
    document.querySelector('.patient-avatar').src = data.avatarUrl;

    // Update patient details
    const infoCard = document.querySelector('.info-card dl');
    infoCard.innerHTML = `
        <dt>Gender:</dt><dd>${data.gender}</dd>
        <dt>Blood Type:</dt><dd>${data.bloodType}</dd>
        <dt>Allergies:</dt><dd>${data.allergies.join(', ')}</dd>
        <dt>Diseases:</dt><dd>${data.diseases.join(', ')}</dd>
        <dt>Height:</dt><dd>${data.height} cm</dd>
        <dt>Weight:</dt><dd>${data.weight} kg</dd>
        <dt>Patient ID:</dt><dd>${data.patientId}</dd>
        <dt>Last Visit:</dt><dd>${new Date(data.lastVisit).toLocaleDateString()}</dd>
    `;

    // Update vitals
    document.querySelector('.vital-card:nth-child(1) .vital-value').innerHTML = `${data.heartRate} <span>bpm</span>`;
    document.querySelector('.vital-card:nth-child(2) .vital-value').innerHTML = `${data.temperature} <span>°C</span>`;
    document.querySelector('.vital-card:nth-child(3) .vital-value').innerHTML = `${data.glucose} <span>mg/dl</span>`;

    // Update test reports
    const testReports = document.querySelector('.test-reports');
    testReports.innerHTML = '<h3>Test Reports</h3>';
    data.testReports.forEach(report => {
        testReports.innerHTML += `
            <div class="report">
                <div class="icon-container ${report.color}-bg">
                    <i class="material-icons">${report.icon}</i>
                </div>
                <div class="report-details">
                    <p class="title">${report.title}</p>
                    <p class="date">${new Date(report.date).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });

    // Update prescriptions
    const prescriptionTable = document.querySelector('.prescription-table tbody');
    prescriptionTable.innerHTML = '';
    data.prescriptions.forEach(prescription => {
        prescriptionTable.innerHTML += `
            <tr>
                <td class="title">${prescription.title}</td>
                <td class="date">${new Date(prescription.date).toLocaleDateString()}</td>
                <td class="duration">${prescription.duration}</td>
            </tr>
        `;
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('accountNumber');
    window.location.href = 'login.html';
}

async function updatePatientInfo() {
    const height = prompt('Enter new height (in cm):');
    const weight = prompt('Enter new weight (in kg):');

    if (height && weight) {
        try {
            const response = await fetch('http://localhost:3000/update-patient-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ height, weight })
            });

            if (!response.ok) {
                throw new Error('Failed to update patient info');
            }

            alert('Patient info updated successfully');
            fetchPatientData();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update patient info. Please try again later.');
        }
    }
}

async function addPrescription() {
    const title = prompt('Enter prescription title:');
    const duration = prompt('Enter prescription duration:');

    if (title && duration) {
        try {
            const response = await fetch('http://localhost:3000/add-prescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, duration })
            });

            if (!response.ok) {
                throw new Error('Failed to add prescription');
            }

            alert('Prescription added successfully');
            fetchPatientData();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add prescription. Please try again later.');
        }
    }
}

async function fetchNotifications() {
    try {
        const response = await fetch('http://localhost:3000/notifications', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }

        const notifications = await response.json();
        displayNotifications(notifications);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch notifications. Please try again later.');
    }
}

function displayNotifications(notifications) {
    const notificationList = notifications.map(notification => 
        `<li>${notification.message} (${new Date(notification.date).toLocaleDateString()})</li>`
    ).join('');

    const notificationModal = document.createElement('div');
    notificationModal.className = 'notification-modal';
    notificationModal.innerHTML = `
        <div class="notification-content">
            <h3>Notifications</h3>
            <ul>${notificationList}</ul>
            <button onclick="this.closest('.notification-modal').remove()">Close</button>
        </div>
    `;

    document.body.appendChild(notificationModal);
}

function setupSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            // Implement sidebar navigation logic here
            alert(`Navigate to ${link.getAttribute('href')} functionality to be implemented`);
        });
    });
}