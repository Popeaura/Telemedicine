document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login .form-container');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = 'Logging in...';

        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('accountNumber', data.accountNumber);
                alert(`Login Successful! Your Account Number: ${data.accountNumber}`);
                window.location.href = 'patient_dashboard.html';
            } else {
                const error = await response.json();
                alert(`Login Failed: ${error.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again later.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Login';
        }
    });
});