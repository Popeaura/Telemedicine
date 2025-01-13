document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationModal = document.getElementById('notificationModal');
    const closeModal = document.getElementById('closeModal');

    // Toggle sidebar
    content.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Open notification modal
    notificationsBtn.addEventListener('click', function() {
        notificationModal.style.display = 'block';
    });

    // Close notification modal
    closeModal.addEventListener('click', function() {
        notificationModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == notificationModal) {
            notificationModal.style.display = 'none';
        }
    });
});

