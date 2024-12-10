window.onload = function () {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const signupError = document.getElementById('signup-error');
            const passwordError = document.getElementById('password-error');

            signupError.textContent = '';
            passwordError.textContent = '';

            // Check if passwords match
            if (password !== confirmPassword) {
                passwordError.textContent = 'Passwords do not match. Please try again.';
                return;
            }

            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                signupError.textContent = 'Please enter a valid email address.';
                return;
            }

            try {
                // Check if email already exists
                const emailCheckResponse = await fetch('http://localhost:5000/api/users/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const emailExists = await emailCheckResponse.json();

                if (emailExists.exists) {
                    signupError.textContent = 'Email is already in use. Please use a different one.';
                    return;
                }

                // Create new user object
                const newUser = {
                    name: name,
                    email: email,
                    password: password, // Password should be hashed in the backend
                    confirmPassword: confirmPassword,
                    role: 'user', // Default role is 'user'
                    profilePic: '', // Optionally send a profilePic if applicable
                    address: '', // Optionally send an address if applicable
                    phone: '' // Optionally send a phone number if applicable
                };                

                // Send the user data to the server to store in MongoDB
                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });                

                if (response.ok) {
                    // Redirect to login page after successful signup
                    window.location.href = 'login_page.html';
                } else {
                    signupError.textContent = 'An error occurred during signup. Please try again later.';
                }

            } catch (error) {
                console.error('Error during signup:', error);
                signupError.textContent = 'Failed to connect to the server. Please try again later.';
            }
        });
    }

    // Toggle password visibility
    const togglePasswordSignup = document.getElementById('toggle-password-signup');
    if (togglePasswordSignup) {
        togglePasswordSignup.addEventListener('click', function () {
            const passwordField = document.getElementById('password');
            passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
            this.textContent = passwordField.type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function () {
            const confirmPasswordField = document.getElementById('confirm-password');
            confirmPasswordField.type = confirmPasswordField.type === 'password' ? 'text' : 'password';
            this.textContent = confirmPasswordField.type === 'password' ? 'visibility' : 'visibility_off';
        });
    }
};
