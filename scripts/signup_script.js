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

            // Check if email already exists
            if (localStorage.getItem(email)) {
                signupError.textContent = 'Email is already in use. Please use a different one.';
            } else {
                // Get the next available user ID based on the highest 'user_' ID stored
                const newUserId = getNextId('user_');

                // Create a new user object with additional fields
                const user = {
                    id: newUserId,
                    name: name,
                    email: email,
                    password: password,
                    profilePic: '', // Initialize as empty
                    address: '',    // Initialize as empty
                    phone: ''       // Initialize as empty
                };

                // Store the user in localStorage with the 'user_' prefix
                localStorage.setItem(`user_${newUserId}`, JSON.stringify(user));

                // Redirect to login page after successful signup
                window.location.href = 'login_page.html';
            }
        });
    }

    // Function to get the next available ID for the 'user_' prefix
    function getNextId(prefix) {
        let highestId = 0; // Default ID to start from 0

        // Loop through all entries in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedItem = JSON.parse(localStorage.getItem(key));

                // Check if the key starts with the 'user_' prefix and if it has a valid ID
                if (key.startsWith(prefix) && storedItem && storedItem.id) {
                    highestId = Math.max(highestId, storedItem.id); // Get the highest ID for that prefix
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }

        // Return the next available ID (highest ID + 1)
        return highestId + 1;
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
