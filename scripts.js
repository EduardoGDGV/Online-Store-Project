window.onload = function () {
    // Login process (with no auto-login)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');

            loginError.textContent = ''; // Clear previous errors

            try {
                const storedUser = JSON.parse(localStorage.getItem(email));

                if (storedUser && storedUser.password === password) {
                    localStorage.setItem('loggedInUser', email);  // Set the logged-in user
                    window.location.href = 'main_page.html';      // Redirect to the main page after successful login
                } else {
                    loginError.textContent = 'Invalid email or password. Please try again.';
                }
            } catch (e) {
                console.error('Error retrieving user data:', e);
                loginError.textContent = 'An error occurred while logging in. Please try again.';
            }
        });
    }

    // Signup process
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value; // Get confirm password
            const signupError = document.getElementById('signup-error'); // Error message div
            const passwordError = document.getElementById('password-error'); // Error message div

            signupError.textContent = ''; // Clear previous errors
            passwordError.textContent = ''; // Clear previous errors

            // Check if passwords match
            if (password !== confirmPassword) {
                passwordError.textContent = 'Passwords do not match. Please try again.';
                return; // Stop further processing
            }

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
                window.location.href = 'login_page.html'; // Redirect to login after signup
            }
        });
    }

    // Toggle password visibility for login
    const togglePasswordLogin = document.getElementById('toggle-password-login');
    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', function () {
            const passwordField = document.getElementById('login-password');
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Toggle password visibility for signup
    const togglePasswordSignup = document.getElementById('toggle-password-signup');
    if (togglePasswordSignup) {
        togglePasswordSignup.addEventListener('click', function () {
            const passwordField = document.getElementById('password');
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off'; // Change icon based on visibility
        });
    }

    // Toggle confirm password visibility for signup
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function () {
            const confirmPasswordField = document.getElementById('confirm-password');
            const type = confirmPasswordField.type === 'password' ? 'text' : 'password';
            confirmPasswordField.type = type;
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off'; // Change icon based on visibility
        });
    }

    // Logout process (optional, but included if needed)
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('loggedInUser'); // Remove the logged-in user
            window.location.href = 'login_page.html';  // Redirect to login page after logout
        });
    }
};
