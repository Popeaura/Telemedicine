document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

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
        const phonePattern = /^[+0-9]{1,3}?[-.\s]?[0-9]{1,4}?[-.\s]?[0-9]{1,4}?[-.\s]?[0-9]{1,9}$/;
        if (!phonePattern.test(phone.value.trim())) {
            showError(phone, 'Phone number must be valid');
            isValid = false;
        }

        // Validate Username
        const username = document.getElementById('username');
        const usernamePattern = /^[a-zA-Z0-9_]+$/;
        if (!usernamePattern.test(username.value.trim())) {
            showError(username, 'Username can only contain letters, numbers, and underscores');
            isValid = false;
        }

        // Validate Password
        const password = document.getElementById('password');
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(password.value.trim())) {
            showError(password, 'Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character');
            isValid = false;
        }

        // If there are validation errors, prevent form submission
        if (!isValid) {
            return;
        }

        // Collect form data
        const formData = {
            firstname: firstName.value.trim(),
            lastname: lastName.value.trim(),
            age: age.value.trim(),
            email: email.value.trim(),
            tel: phone.value.trim(),
            username: username.value.trim(),
            password: password.value.trim(),
            role: "patient", // Example static role
        };

        try {
            // Submit form data to the server
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Registration successful! Redirecting...');
                window.location.href = 'login.html'; // Replace with the actual path to your login page
            } else {
                const error = await response.json();
                alert(`Registration failed: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            alert('An error occurred while submitting the form.');
            console.error(error);
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
