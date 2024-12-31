document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous error messages
        clearErrors();

        let isValid = true;

        // Perform client-side validation here
        // (Add your validation logic)

        if (!isValid) {
            return; // Stop if validation fails
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Registering...';

        // Collect form data
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        jsonData.role = "patient"; // Add role if it's not in the form

        console.log('Submitting form data:', jsonData);

        try {
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
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
                showError(form, `Registration failed: ${error.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showError(form, 'An error occurred while submitting the form. Please try again later.');
        } finally {
            // Re-enable submit button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
        }
    });

    // Function to show an error message
    function showError(element, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerText = message;
        element.insertAdjacentElement('afterend', error);
    }

    // Function to clear all error messages
    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());

        const inputs = document.querySelectorAll('.input-error');
        inputs.forEach(input => input.classList.remove('input-error'));
    }
});