window.onload = function () {
    // Very secure very real implementation
    const defaultAdmin = {
        id: -1,
        name: 'Default Admin',
        email: 'admin@example.com',
        password: 'admin', // Ensure this is stored securely in a real application
    };

    // Store the default admin in localStorage if it doesn't already exist
    if (!localStorage.getItem(defaultAdmin.email)) {
        localStorage.setItem(defaultAdmin.email, JSON.stringify(defaultAdmin));
    }

    // Login process (with no auto-login)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const loginError = document.getElementById('login-error');
            const storedLocal = JSON.parse(localStorage.getItem(email));

            loginError.textContent = ''; // Clear previous errors

            try {
                // Check for admin credentials
                if (storedLocal && storedLocal.id < 0) {
                    localStorage.setItem('isAdminLoggedIn', 'true'); // Set admin logged in status
                    window.location.href = 'admin_page.html'; // Redirect to admin area
                } else {
                    // Regular user login check
                    if (storedLocal && storedLocal.password === password) {
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
                    id: localStorage.length + 1,
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

    // Handle profile photo change
    document.getElementById('upload-photo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-pic').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission (save changes)
    document.getElementById('profile-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // You can implement form validation or save the data to the server here
        alert('Profile updated successfully!');
    });

    // Logout process (optional, but included if needed)
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('loggedInUser'); // Remove the logged-in user
            localStorage.removeItem('isAdminLoggedIn'); // Remove admin logged in status
            window.location.href = 'landing_page.html';  // Redirect to login page after logout
        });
    }

    // Show Customers functionality
    document.getElementById('view-customers-btn').addEventListener('click', showCustomers);

    // Show Admins functionality
    document.getElementById('view-admins-btn').addEventListener('click', showAdmins);

    // Fetch and display customers from localStorage
    function fetchCustomers() {
        const customersBody = document.getElementById('customers-body');
        customersBody.innerHTML = ''; // Clear previous content

        // Iterate over all items in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedUser = JSON.parse(localStorage.getItem(key));

                // Check if the entry is valid and has a name and email property
                if (storedUser && storedUser.id >= 0 && storedUser.name && storedUser.email) {
                    const row = document.createElement('tr');

                    // Create id cell
                    const idCell = document.createElement('td');
                    idCell.textContent = storedUser.id;
                    row.appendChild(idCell);

                    // Create name cell
                    const nameCell = document.createElement('td');
                    nameCell.textContent = storedUser.name;
                    row.appendChild(nameCell);

                    // Create email cell
                    const emailCell = document.createElement('td');
                    emailCell.textContent = storedUser.email;
                    row.appendChild(emailCell);

                    // Create action cell with a delete button
                    const actionCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.setAttribute('data-id', key); // Use localStorage key as identifier
                    deleteButton.addEventListener('click', () => deleteCustomer(key));
                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);

                    // Append the row to the table body
                    customersBody.appendChild(row);
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
                // Skip over entries that are not valid JSON
            }
        }
    }

    // Fetch and display admins from localStorage
    function fetchAdmins() {
        const adminsBody = document.getElementById('admins-body');
        adminsBody.innerHTML = ''; // Clear previous content

        // Iterate over all items in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedAdmin = JSON.parse(localStorage.getItem(key)); // Attempt to parse the value
    
                // Check if parsedValue is an object and has the expected properties
                if (storedAdmin && storedAdmin.id < 0 && storedAdmin.name && storedAdmin.email) {
                    // Check if the entry is an admin
                    const row = document.createElement('tr');

                    // Create name cell
                    const idCell = document.createElement('td');
                    idCell.textContent = -storedAdmin.id;
                    row.appendChild(idCell);

                    // Create name cell
                    const nameCell = document.createElement('td');
                    nameCell.textContent = storedAdmin.name;
                    row.appendChild(nameCell);

                    // Create email cell
                    const emailCell = document.createElement('td');
                    emailCell.textContent = storedAdmin.email;
                    row.appendChild(emailCell);

                    // Create action cell with a delete button
                    const actionCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';

                    // Logic to prevent deletion of the first admin
                    if (storedAdmin.email === "admin@example.com") {
                        deleteButton.disabled = true; // Disable delete button for the first admin
                        deleteButton.textContent = "Cannot Delete"; // Update button text

                        // Add classes for styling
                        deleteButton.classList.add('disabled-button'); // Add a class for custom styles
                        deleteButton.style.backgroundColor = 'lightgrey'; // Set background color to light grey
                        deleteButton.style.color = 'darkgrey'; // Set text color to dark grey
                        deleteButton.style.border = 'none'; // Remove border
                        deleteButton.style.cursor = 'not-allowed'; // Change cursor to indicate no action
                    } else {
                        deleteButton.addEventListener('click', () => deleteAdmin(key)); // Add delete event
                    }

                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);

                    // Append the row to the table body
                    adminsBody.appendChild(row);
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
                // Skip over entries that are not valid JSON
            }

        }
    }

    // Show or hide customers when button is clicked
    function showCustomers() {
        const viewCustomersSection = document.getElementById('view-customers');
        const viewCustomersBtn = document.getElementById('view-customers-btn'); // The button element
        const otherContent = document.getElementsByClassName('admin-content'); // This is a collection
        const viewAdminsSection = document.getElementById('view-admins'); // Reference to the admin section
        const adminsBtn = document.getElementById('view-admins-btn'); // Reference to the admin button
        const productsBtn = document.getElementById('view-products'); // Reference to the products button
        const textProd = document.getElementById('prodtitle'); // Reference to the products title

        // Toggle visibility
        if (viewCustomersSection.classList.contains('hide')) {
            // Hide other sections, including admins
            if (viewAdminsSection) {
                viewAdminsSection.classList.add('hide');
            }
            if (adminsBtn) {
                adminsBtn.classList.add('hide');
            }
            if (productsBtn) {
                productsBtn.classList.add('hide');
            }
            if (textProd) {
                textProd.classList.add('hide');
            }
            Array.from(otherContent).forEach(function (element) {
                element.classList.add('hide');
            });

            viewCustomersSection.classList.remove('hide');
            viewCustomersBtn.textContent = 'Hide Customers'; // Change button text to 'Hide Customers'

            // Fetch customers when showing
            fetchCustomers();

        } else {
            viewCustomersSection.classList.add('hide');
            viewCustomersBtn.textContent = 'View Customers'; // Change button text back to 'View Customers'

            adminsBtn.classList.remove('hide');
            productsBtn.classList.remove('hide');
            textProd.classList.remove('hide');

            // Show other sections
            Array.from(otherContent).forEach(function (element) {
                element.classList.remove('hide');
            });
        }
    }

    // Show or hide admins when button is clicked
    function showAdmins() {
        const viewAdminsSection = document.getElementById('view-admins');
        const viewAdminsBtn = document.getElementById('view-admins-btn'); // The button element
        const otherContent = document.getElementsByClassName('admin-content'); // This is a collection
        const viewCustomersSection = document.getElementById('view-customers'); // Reference to the customer section
        const custoBtn = document.getElementById('view-customers-btn'); // Reference to the admin button
        const productsBtn = document.getElementById('view-products'); // Reference to the products button
        const textProd = document.getElementById('prodtitle'); // Reference to the products title

        // Toggle visibility
        if (viewAdminsSection.classList.contains('hide')) {
            // Hide other sections, including customers
            if (viewCustomersSection) {
                viewCustomersSection.classList.add('hide');
            }
            if (custoBtn) {
                custoBtn.classList.add('hide');
            }
            if (productsBtn) {
                productsBtn.classList.add('hide');
            }
            if (textProd) {
                textProd.classList.add('hide');
            }
            Array.from(otherContent).forEach(function (element) {
                element.classList.add('hide');
            });

            viewAdminsSection.classList.remove('hide');
            viewAdminsBtn.textContent = 'Hide Admins'; // Change button text to 'Hide Admins'

            // Fetch admins when showing
            fetchAdmins();

        } else {
            custoBtn.classList.remove('hide');
            productsBtn.classList.remove('hide');
            textProd.classList.remove('hide');
            viewAdminsSection.classList.add('hide');
            viewAdminsBtn.textContent = 'View Admins'; // Change button text back to 'View Admins'

            // Show other sections
            Array.from(otherContent).forEach(function (element) {
                element.classList.remove('hide');
            });
        }
    }

    // Delete customer from localStorage
    function deleteCustomer(key) {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            localStorage.removeItem(key); // Remove the customer from localStorage
            fetchCustomers(); // Refresh the customer list after deletion
        }
    }

    // Delete admin from localStorage
    function deleteAdmin(key) {
        const confirmDelete = confirm('Are you sure you want to delete this admin?');
        if (confirmDelete) {
            localStorage.removeItem(key); // Remove the admin from localStorage
            fetchAdmins(); // Refresh the admin list after deletion
        }
    }

    // Sample structure of cart items (if stored in localStorage)
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items on the page
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        let cartTotal = 0;

        // Clear the container before rendering
        cartItemsContainer.innerHTML = '';

        // Loop through cart items and display them
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            `;

            cartItemsContainer.appendChild(cartItem);

            // Calculate the total
            cartTotal += item.price * item.quantity;
        });

        // Update the cart total
        cartTotalElement.innerText = cartTotal.toFixed(2);
    }

    // Redirect to payment page
    document.getElementById('proceed-to-payment').addEventListener('click', () => {
        if (cartItems.length > 0) {
            window.location.href = 'payment_page.html';  // Redirect to payment page
        } else {
            alert('Your cart is empty.');
        }
    });

    // Initialize cart items on page load
    document.addEventListener('DOMContentLoaded', renderCartItems);
};
