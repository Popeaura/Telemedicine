document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#register-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = 'Registering...';

        clearErrors();
        let isValid = true;

        form.querySelectorAll('input[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('input-error');
                showError(input, `${input.placeholder || input.name} is required`);
            }
        });

        const email = form.querySelector('input[name="email"]');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            isValid = false;
            showError(email, 'Invalid email address');
        }

        if (!isValid) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Create Account';
            return;
        }

        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        jsonData.role = "patient";

        try {
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Registration Successful! Your Account Number: ${data.accountNumber}`);
                window.location.href = 'login.html';
            } else {
                const error = await response.json();
                alert(`Registration Failed: ${error.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again later.');
        } finally {
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
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
    }
});