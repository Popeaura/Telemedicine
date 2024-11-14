document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container');
    
    form.addEventListener('submit', function(event) {
        // Clear previous error messages
        clearErrors();

        let isValid = true;

        // Validate First Name
        const firstName = document.getElementById('firstname');
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required');
            isValid = false;
        }

        // Validate Last Name
        const lastName = document.getElementById('lastname');
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required');
            isValid = false;
        }

        // Validate Age
        const age = document.getElementById('age');
        if (age.value.trim() === '' || isNaN(age.value) || age.value < 18) {
            showError(age, 'Age is required and must be 18 or older');
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Phone Number
        const phone = document.getElementById('tel');
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone.value.trim())) {
            showError(phone, 'Phone number must be 10 digits');
            isValid = false;
        }

        // Validate Username
        const username = document.getElementById('new-username');
        if (username.value.trim().length < 4) {
            showError(username, 'Username must be at least 4 characters');
            isValid = false;
        }

        // Validate Password
        const password = document.getElementById('password');
        if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        // Prevent form submission if there are validation errors
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Function to show an error message
    function showError(element, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerText = message;
        element.parentElement.insertBefore(error, element.nextSibling);
        element.classList.add('input-error');
    }

    // Function to clear all error messages
    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());

        const inputs = document.querySelectorAll('.input-error');
        inputs.forEach(input => input.classList.remove('input-error'));
    }
});
