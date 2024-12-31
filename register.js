document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous error messages
        clearErrors();

        let isValid = true;

        // (Validation code remains the same)

        if (!isValid) {
            return; // Stop if validation fails
        }

        // Collect form data
        const formData = {
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
            age: document.getElementById('age').value.trim(),
            email: document.getElementById('email').value.trim(),
            tel: document.getElementById('tel').value.trim(),
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value.trim(),
            role: "patient",
        };

        console.log('Submitting form data:', formData);

        try {
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response received:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Success response data:', data);
                alert(data.message || 'Registration successful!');
                window.location.href = 'login.html'; // Redirect on success
            } else {
                const error = await response.json();
                console.error('Error response data:', error);
                alert(`Registration failed: ${error.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            alert('An error occurred while submitting the form.');
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
