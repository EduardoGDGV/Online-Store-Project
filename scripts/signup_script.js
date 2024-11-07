window.onload = function () {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const signupError = document.getElementById('signup-error');
            const passwordError = document.getElementById('password-error');

            signupError.textContent = '';
            passwordError.textContent = '';

            if (password !== confirmPassword) {
                passwordError.textContent = 'Passwords do not match. Please try again.';
                return;
            }

            if (localStorage.getItem(email)) {
                signupError.textContent = 'Email is already in use. Please use a different one.';
            } else {
                const user = {
                    id: localStorage.length + 1,
                    name: name,
                    email: email,
                    password: password
                };
                localStorage.setItem(email, JSON.stringify(user));
                window.location.href = 'login_page.html';
            }
        });
    }
    
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
