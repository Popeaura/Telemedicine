document.addEventListener('DOMContentLoaded', function() {
    // Back button functionality
    var backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', function() {
        console.log('Back button clicked');
        // Implement navigation logic here
    });

    // Notifications button functionality
    var notificationsButton = document.querySelector('.notifications');
    notificationsButton.addEventListener('click', function() {
        console.log('Notifications button clicked');
        // Implement notifications display logic here
    });

    // Update button functionality
    var updateButton = document.querySelector('.update-button');
    updateButton.addEventListener('click', function() {
        console.log('Update button clicked');
        // Implement patient info update logic here
    });

    // Add prescription button functionality
    var addPrescriptionButton = document.querySelector('.add-prescription');
    addPrescriptionButton.addEventListener('click', function() {
        console.log('Add prescription button clicked');
        // Implement add prescription logic here
    });

    // Sidebar navigation functionality
    var sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            this.classList.add('active');
            console.log('Navigated to: ' + this.getAttribute('href'));
            // Implement navigation logic here
        });
    });

    // Logout button functionality
    var logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', function() {
        console.log('Logout button clicked');
        // Implement logout logic here
    });

    // Example of dynamically updating patient vitals
    function updateVitals(heartRate, temperature, glucose) {
        document.querySelector('.vital-card:nth-child(1) .vital-value').textContent = heartRate + ' bpm';
        document.querySelector('.vital-card:nth-child(2) .vital-value').textContent = temperature + ' °C';
        document.querySelector('.vital-card:nth-child(3) .vital-value').textContent = glucose + ' mg/dl';
    }

    // Example usage of updateVitals function
    // updateVitals(75, 36.8, 95);

    // Function to add a new test report
    function addTestReport(name, date) {
        var reportsContainer = document.querySelector('.test-reports');
        var newReport = document.createElement('div');
        newReport.className = 'report';
        newReport.innerHTML = `
            <i class="icon-file-text"></i>
            <div>
                <p>${name}</p>
                <p class="date">${date}</p>
            </div>
        `;
        reportsContainer.appendChild(newReport);
    }

    // Example usage of addTestReport function
    // addTestReport('Blood Test', '15th June 2023');

    // Function to add a new prescription
    function addPrescription(name, date, duration) {
        var prescriptionsContainer = document.querySelector('.prescriptions');
        var newPrescription = document.createElement('div');
        newPrescription.className = 'prescription';
        newPrescription.innerHTML = `
            <p>${name}</p>
            <p>${date}</p>
            <p>${duration}</p>
        `;
        prescriptionsContainer.insertBefore(newPrescription, addPrescriptionButton);
    }

    // Example usage of addPrescription function
    // addPrescription('Antibiotic', '20th June 2023', '7 days');
});