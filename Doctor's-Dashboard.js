document.addEventListener('DOMContentLoaded', function () {
    // Dummy data for profile information (replace with actual data from server)
    const profileData = {
        name: 'Dr. John Doe',
        email: 'john.doe@example.com',
        contact: '+1234567890',
        specialization: 'Cardiologist',
        healthInfo: 'No major health issues reported.'
    };

    // Function to populate profile information
    function populateProfile() {
        document.getElementById('profileInfo').innerHTML = `
            <p><strong>Name:</strong> ${profileData.name}</p>
            <p><strong>Email:</strong> ${profileData.email}</p>
            <p><strong>Contact Number:</strong> ${profileData.contact}</p>
            <p><strong>Specialization:</strong> ${profileData.specialization}</p>
            <p><strong>Health Information:</strong> ${profileData.healthInfo}</p>
        `;
    }

    // Function to handle profile update form submission
    function handleProfileUpdate(event) {
        event.preventDefault();
        // Collect form data and update profileData (replace with actual server request)
        profileData.name = document.getElementById('name').value;
        profileData.email = document.getElementById('email').value;
        profileData.contact = document.getElementById('contact').value;
        profileData.specialization = document.getElementById('specialization').value;
        alert('Profile updated successfully');
        populateProfile();
    }

    // Function to handle health information update form submission
    function handleHealthInfoUpdate(event) {
        event.preventDefault();
        // Collect form data and update healthInfo (replace with actual server request)
        profileData.healthInfo = document.getElementById('healthInfo').value;
        alert('Health information updated successfully');
    }

    // Event listeners for form submissions
    document.getElementById('editProfileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('updateHealthInfoForm').addEventListener('submit', handleHealthInfoUpdate);

    // Populate profile on page load
    populateProfile();
    
    // Dummy data for appointments
    const appointments = [
        { id: 1, date_scheduled: '2024-09-20', appointment_type: 'Check-up', appointment_status: 'Pending', description: 'Routine check-up with Dr. John Doe.' },
        { id: 2, date_scheduled: '2024-09-21', appointment_type: 'Consultation', appointment_status: 'Confirmed', description: 'Consultation for heart issues.' }
    ];

    // Function to populate appointments
    function populateAppointments() {
        const appointmentList = document.getElementById('appointmentList');
        appointmentList.innerHTML = ''; // Clear previous entries
        appointments.forEach(appointment => {
            const appointmentItem = document.createElement('div');
            appointmentItem.className = 'appointment-item';
            appointmentItem.innerHTML = `
                <p><strong>Date Scheduled:</strong> ${appointment.date_scheduled}</p>
                <p><strong>Appointment Type:</strong> ${appointment.appointment_type}</p>
                <p><strong>Appointment Status:</strong> ${appointment.appointment_status}</p>
                <p><strong>Description:</strong> ${appointment.description}</p>
                <button data-id="${appointment.id}" class="accept-appointment">Accept</button>
                <button data-id="${appointment.id}" class="deny-appointment">Deny</button>
            `;
            appointmentList.appendChild(appointmentItem);
        });
    }

    // Function to handle appointment acceptance
    function handleAppointmentAccept(id) {
        alert(`Appointment ${id} accepted`);
        const index = appointments.findIndex(a => a.id === id);
        appointments.splice(index, 1);
        populateAppointments();
    }

    // Function to handle appointment denial
    function handleAppointmentDeny(id) {
        alert(`Appointment ${id} denied`);
        const index = appointments.findIndex(a => a.id === id);
        appointments.splice(index, 1);
        populateAppointments();
    }

    // Event delegation for appointment buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('accept-appointment')) {
            handleAppointmentAccept(parseInt(event.target.getAttribute('data-id')));
        } else if (event.target.classList.contains('deny-appointment')) {
            handleAppointmentDeny(parseInt(event.target.getAttribute('data-id')));
        }
    });

    // Populate lists on page load
    populateAppointments();

    // Set active class on navigation links
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});