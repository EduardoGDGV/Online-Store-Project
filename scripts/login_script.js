window.onload = function () {
    const defaultAdmin = {
        id: '-1',
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'admin',
    };

    // Set up default admin with admin_ prefix in localStorage if not already set
    const defaultAdminKey = 'admin_' + defaultAdmin.id;  // Using admin_ as prefix for default admin
    if (!localStorage.getItem(defaultAdminKey)) {
        localStorage.setItem(defaultAdminKey, JSON.stringify(defaultAdmin));
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');

            loginError.textContent = '';

            let storedLocal = null;
            let isAdmin = false;

            // Loop through all items in localStorage to find matching email with the correct prefix
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const userData = JSON.parse(localStorage.getItem(key));

                    // Check if the email matches
                    if (userData.email === email) {
                        storedLocal = userData;

                        // Determine if this is an admin (admin_ prefix) or a user (user_ prefix)
                        if (key.startsWith('admin_')) {
                            isAdmin = true;
                        }

                        break; // Stop once we find the matching user
                    }
                }
            }

            // Validate password and proceed with login
            if (storedLocal && storedLocal.password === password) {
                // Clear any previous login data
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('isAdminLoggedIn');

                // Set new login status based on user type
                if (isAdmin) {  // Admin login
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    window.location.href = 'admin_page.html';
                } else {  // Customer login
                    localStorage.setItem('loggedInUser', email);
                    window.location.href = 'main_page.html';
                }
            } else {
                loginError.textContent = 'Invalid email or password. Please try again.';
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
