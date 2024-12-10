window.onload = function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const loginError = document.getElementById('login-error');
            loginError.textContent = ''; // Clear previous errors

            // Basic validation before sending the request
            if (!email || !password) {
                loginError.textContent = 'Please enter both email and password.';
                return;
            }

            try {
                // Send login credentials to the server
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log('Login successful:', userData);

                    // Store the logged-in user data in sessionStorage
                    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

                    // Redirect based on user role
                    if (userData.role === 'admin') {
                        window.location.href = 'admin_page.html'; // Redirect to admin page
                    } else {
                        window.location.href = 'main_page.html'; // Redirect to main page
                    }
                } else if (response.status === 401) {
                    loginError.textContent = 'Invalid email or password. Please try again.';
                } else {
                    loginError.textContent = 'An error occurred. Please try again later.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginError.textContent = 'Failed to connect to the server. Please try again later.';
            }
        });
    }

    // Toggle password visibility
    const togglePasswordLogin = document.getElementById('toggle-password-login');
    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', function () {
            const passwordField = document.getElementById('login-password');
            passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
            this.textContent = passwordField.type === 'password' ? 'visibility' : 'visibility_off';
        });
    }
};
