document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility for login
    const togglePasswordLogin = document.getElementById('toggle-password-login');
    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', function() {
            const passwordField = document.getElementById('login-password');
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Toggle password visibility for signup
    const togglePasswordSignup = document.getElementById('toggle-password-signup');
    if (togglePasswordSignup) {
        togglePasswordSignup.addEventListener('click', function() {
            const passwordField = document.getElementById('password');
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Login process (with no auto-login)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');

            loginError.textContent = ''; // Clear previous errors

            const storedUser = JSON.parse(localStorage.getItem(email));

            if (storedUser && storedUser.password === password) {
                localStorage.setItem('loggedInUser', email);  // Set the logged-in user
                window.location.href = 'main_page.html';      // Redirect to the main page after successful login
            } else {
                loginError.textContent = 'Invalid email or password. Please try again.';
            }
        });
    }

    // Signup process
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const signupError = document.getElementById('signup-error');

            signupError.textContent = ''; // Clear previous errors

            // Check if email is already registered
            if (localStorage.getItem(email)) {
                signupError.textContent = 'Email is already in use. Please use a different one.';
            } else {
                const user = {
                    name: name,
                    email: email,
                    password: password
                };
                localStorage.setItem(email, JSON.stringify(user));
                window.location.href = 'login_page.html';  // Redirect to login page after signup
            }
        });
    }

    // Logout process (optional, but included if needed)
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser'); // Remove the logged-in user
            window.location.href = 'login_page.html';  // Redirect to login page after logout
        });
    }
});
