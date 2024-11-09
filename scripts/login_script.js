window.onload = function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');
            loginError.textContent = ''; // Clear previous errors

            let storedLocal = null;
            let isAdmin = false;

            // Loop through all items in localStorage to find matching email with the correct prefix
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && (key.startsWith('user_') || key.startsWith('admin_'))) {
                    let userData = null;
                    try {
                        userData = JSON.parse(localStorage.getItem(key));
                    } catch (error) {
                        console.error(`Failed to parse item with key: ${key}`, error);
                        continue; // Skip items that are not valid JSON
                    }

                    console.log('Checking key:', key, 'userData:', userData);

                    // Check if the email matches
                    if (userData && userData.email === email) {
                        // Check for the correct prefix to determine if user is admin or regular user
                        if (key.startsWith('admin_')) {
                            isAdmin = true;  // This is an admin
                        } else if (key.startsWith('user_')) {
                            isAdmin = false; // This is a regular user
                        }
                        storedLocal = userData;
                        break; // Stop once we find the matching user
                    }
                }
            }

            // Validate password and proceed with login
            if (storedLocal && storedLocal.password === password) {
                console.log('Login success!'); // Debugging statement
                // Clear previous login data
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('isAdminLoggedIn');

                // Set new login status based on user type
                if (isAdmin) {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    window.location.href = 'admin_page.html'; // Redirect to admin page
                } else {
                    localStorage.setItem('loggedInUser', JSON.stringify(storedLocal));
                    window.location.href = 'main_page.html'; // Redirect to main page
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
