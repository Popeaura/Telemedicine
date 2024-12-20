document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Patients',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#0d9488',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Add click event listener to the add prescription button
    const addPrescriptionBtn = document.querySelector('.add-prescription');
    addPrescriptionBtn.addEventListener('click', function() {
        alert('Add prescription functionality to be implemented.');
    });

    // Add click event listener to the update button
    const updateBtn = document.querySelector('.update-button');
    updateBtn.addEventListener('click', function() {
        alert('Update patient information functionality to be implemented.');
    });

    // Add click event listener to the notifications button
    const notificationsBtn = document.querySelector('.notifications');
    notificationsBtn.addEventListener('click', function() {
        alert('Notifications functionality to be implemented.');
    });
});

