document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        clearErrors(); // Clear previous errors
        let isValid = true;

        // Client-side validation
        form.querySelectorAll('input[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('input-error'); // Highlight error field
                showError(input, `${input.placeholder || input.name} is required`);
            }
        });

        const email = form.querySelector('input[name="email"]');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            isValid = false;
            showError(email, 'Invalid email address');
        }

        if (!isValid) return; // Stop if validation fails

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Registering...';

        // Collect form data
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        jsonData.role = "patient"; // Add role if it's not in the form

        try {
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message || 'Registration successful!');
                window.location.href = 'login.html'; // Redirect on success
            } else {
                const error = await response.json();
                showError(form, `Registration failed: ${error.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showError(form, 'An error occurred while submitting the form. Please try again later.');
        } finally {
            // Restore submit button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
        }
    });

    function showError(element, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerText = message;
        element.insertAdjacentElement('afterend', error);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
    }
});


