// Sign up form validation and user registration using localStorage
function registerUser(event) {
    event.preventDefault(); // Prevent the form from submitting

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if the email is already registered
    let existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    let userExists = existingUsers.some(user => user.email === email);

    if (userExists) {
        alert("Email is already registered!");
    } else {
        // Register new user
        let newUser = { name, email, address, phone, password };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        alert("Registration successful! Please login.");
        window.location.href = "login_page.html"; // Redirect to login page
    }
}


// Login form validation and user authentication using localStorage
function loginUser(event) {
    event.preventDefault(); // Prevent the form from submitting

    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    // Get users from localStorage
    let existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Find user
    let foundUser = existingUsers.find(user => user.email === email && user.password === password);

    if (foundUser) {
        alert(`Welcome back, ${foundUser.name}!`);
        window.location.href = "main_page.html"; // Redirect to main page after login
    } else {
        alert("Invalid email or password!");
    }
}
