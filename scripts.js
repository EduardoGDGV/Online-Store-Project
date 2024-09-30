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
                // Check for admin credentials
                if (email === 'admin@example.com' && password === 'admin') {
                    localStorage.setItem('isAdminLoggedIn', 'true'); // Set admin logged in status
                    window.location.href = 'admin_page.html'; // Redirect to admin area
                } else {
                    // Regular user login check
                    const storedUser = JSON.parse(localStorage.getItem(email));
                    if (storedUser && storedUser.password === password) {
                        localStorage.setItem('loggedInUser', email); // Set the logged-in user
                        window.location.href = 'main_page.html'; // Redirect to the main page after successful login
                    } else {
                        loginError.textContent = 'Invalid email or password. Please try again.';
                    }
                }
            } catch (e) {
                console.error('Error retrieving user data:', e);
                loginError.textContent = 'An error occurred while logging in. Please try again.';
            }
        });
    }

    // Ensure admin area is only accessible if logged in
    if (window.location.pathname.endsWith('admin_page.html')) {
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isAdminLoggedIn !== 'true') {
            window.location.href = 'login_page.html'; // Redirect to login if not logged in
        }
    }

    // Handle additional actions in admin area
    const registerAdmin = document.getElementById('register-admin');
    const registerCustomer = document.getElementById('register-customer');
    const registerProduct = document.getElementById('register-product');

    if (registerAdmin) {
        registerAdmin.addEventListener('click', function() {
            alert('Functionality to register an admin will be implemented here.');
        });
    }

    if (registerCustomer) {
        registerCustomer.addEventListener('click', function() {
            alert('Functionality to register a customer will be implemented here.');
        });
    }

    if (registerProduct) {
        registerProduct.addEventListener('click', function() {
            alert('Functionality to register a product will be implemented here.');
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
            localStorage.removeItem('isAdminLoggedIn'); // Remove admin logged in status
            window.location.href = 'login_page.html';  // Redirect to login page after logout
        });
    }
};
