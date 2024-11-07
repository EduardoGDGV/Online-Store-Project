window.onload = function () {
    const defaultAdmin = {
        id: -1,
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'admin',
    };

    // Set up default admin if not already in localStorage
    if (!localStorage.getItem(defaultAdmin.email)) {
        localStorage.setItem(defaultAdmin.email, JSON.stringify(defaultAdmin));
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');
            const storedLocal = JSON.parse(localStorage.getItem(email));

            loginError.textContent = '';

            if (storedLocal && storedLocal.password === password) {
                // Clear any previous login data
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('isAdminLoggedIn');

                // Set new login status
                if (storedLocal.id < 0) {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    window.location.href = 'admin_page.html';
                } else {
                    localStorage.setItem('loggedInUser', email);
                    window.location.href = 'main_page.html';
                }
            } else {
                loginError.textContent = 'Invalid email or password. Please try again.';
            }
        });
    }

    const togglePasswordLogin = document.getElementById('toggle-password-login');
    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', function () {
            const passwordField = document.getElementById('login-password');
            passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
            this.textContent = passwordField.type === 'password' ? 'visibility' : 'visibility_off';
        });
    }
};
