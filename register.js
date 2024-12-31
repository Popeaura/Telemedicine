document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous error messages
        clearErrors();

        let isValid = true;

        // (Validation code remains the same)

        // Prevent form submission if validation fails
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

        console.log('Submitting form data:', formData);

        try {
            // Submit form data to the server
            const response = await fetch('http://127.0.0.1:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Response body:', await response.text());

            if (response.ok) {
                alert('Registration successful! Redirecting...');
                window.location.href = 'login.html'; // Replace with actual URL
            } else {
                const error = await response.json();
                alert(`Registration failed: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred while submitting the form.');
        }
    });

    // (Error handling functions remain unchanged)
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
