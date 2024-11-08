document.addEventListener('DOMContentLoaded', function () {
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
    const viewCustomersBtn = document.getElementById('view-customers-btn');
    const viewAdminsBtn = document.getElementById('view-admins-btn');
    const logoutButton = document.getElementById('logout');

    // Event listeners for Register buttons
    if (registerAdmin) {
        registerAdmin.addEventListener('click', function() {
            createRegisterAdminForm();
        });
    }

    if (registerCustomer) {
        registerCustomer.addEventListener('click', function() {
            // Dynamically create the Register Customer form
            createRegisterCustomerForm();
        });
    }

    if (registerProduct) {
        registerProduct.addEventListener('click', function() {
            alert('Functionality to register a product will be implemented here.');
        });
    }

    if (viewCustomersBtn){
        viewCustomersBtn.addEventListener('click', function() {
            createCustomerTable();
        });
    }

    if (viewAdminsBtn){
        viewAdminsBtn.addEventListener('click', function() {
            createAdminsTable();
        });
    }

    // Fetch and display customers
    function createCustomerTable(){
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const customersSection = document.createElement('div');
        customersSection.innerHTML = `
            <h2>Registered Customers</h2>
            <table id="customers-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="customers-body"></tbody>
            </table>
        `;
        mainContent.appendChild(customersSection);
        fetchCustomers(); // Populate customer data
    }

    // Fetch and display admins
    function createAdminsTable() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const adminsSection = document.createElement('div');
        adminsSection.innerHTML = `
            <h2>Registered Admins</h2>
            <table id="admins-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="admins-body"></tbody>
            </table>
        `;
        mainContent.appendChild(adminsSection);
        fetchAdmins(); // Populate admin data
    }

    // Fetch and display customers from localStorage
    function fetchCustomers() {
        const customersBody = document.getElementById('customers-body');
        customersBody.innerHTML = ''; // Clear previous content

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedUser = JSON.parse(localStorage.getItem(key));
                if (storedUser && storedUser.id >= 0 && storedUser.name && storedUser.email) {
                    const row = document.createElement('tr');
                    const idCell = document.createElement('td');
                    idCell.textContent = storedUser.id;
                    row.appendChild(idCell);
                    const nameCell = document.createElement('td');
                    nameCell.textContent = storedUser.name;
                    row.appendChild(nameCell);
                    const emailCell = document.createElement('td');
                    emailCell.textContent = storedUser.email;
                    row.appendChild(emailCell);
                    const actionCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.setAttribute('data-id', key);
                    deleteButton.addEventListener('click', () => deleteCustomer(key));
                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);
                    customersBody.appendChild(row);
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }
    }

    // Fetch and display admins from localStorage
    function fetchAdmins() {
        const adminsBody = document.getElementById('admins-body');
        adminsBody.innerHTML = ''; // Clear previous content

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedAdmin = JSON.parse(localStorage.getItem(key));
                if (storedAdmin && storedAdmin.id < 0 && storedAdmin.name && storedAdmin.email) {
                    const row = document.createElement('tr');
                    const idCell = document.createElement('td');
                    idCell.textContent = -storedAdmin.id;
                    row.appendChild(idCell);
                    const nameCell = document.createElement('td');
                    nameCell.textContent = storedAdmin.name;
                    row.appendChild(nameCell);
                    const emailCell = document.createElement('td');
                    emailCell.textContent = storedAdmin.email;
                    row.appendChild(emailCell);
                    const actionCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.setAttribute('data-id', key);
                    if (storedAdmin.email === "admin@example.com") {
                        deleteButton.disabled = true;
                        deleteButton.textContent = "Cannot Delete";
                    } else {
                        deleteButton.addEventListener('click', () => deleteAdmin(key));
                    }
                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);
                    adminsBody.appendChild(row);
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }
    }

    // Delete customer from localStorage
    function deleteCustomer(key) {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            localStorage.removeItem(key);
            fetchCustomers(); // Refresh customer list after deletion
        }
    }

    // Delete admin from localStorage
    function deleteAdmin(key) {
        const confirmDelete = confirm('Are you sure you want to delete this admin?');
        if (confirmDelete) {
            localStorage.removeItem(key);
            fetchAdmins(); // Refresh admin list after deletion
        }
    }

    function createRegisterCustomerForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content
    
        // Create the register customer form
        const form = document.createElement('form');
        form.id = 'register-customer-form';
        form.innerHTML = `
            <h2>Register New Customer</h2>
            <div class="form-group">
                <label for="customer-name">Name</label>
                <input type="text" id="customer-name" required>
            </div>
            <div class="form-group">
                <label for="customer-email">Email</label>
                <input type="email" id="customer-email" required>
                <div id="register-customer-error" class="error-message"></div>
            </div>
            <div class="form-group">
                <label for="customer-password">Password</label>
                <input type="password" id="customer-password" required>
            </div>
            <div class="form-group">
                <label for="customer-confirm-password">Confirm Password</label>
                <input type="password" id="customer-confirm-password" required>
                <div id="register-password-error" class="error-message"></div>
            </div>
            <button type="submit" class="admin-register-btn">Register Customer</button>
        `;
    
        mainContent.appendChild(form);
    
        // Set up form submission handler
        form.addEventListener('submit', handleRegisterCustomer);
    }
    
    function handleRegisterCustomer(event) {
        event.preventDefault();
    
        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;
        const confirmPassword = document.getElementById('customer-confirm-password').value;
        const registerError = document.getElementById('register-customer-error');
        const passwordError = document.getElementById('register-password-error');
    
        // Reset any previous error messages
        registerError.textContent = '';
        passwordError.textContent = '';
    
        if (password !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match';
            return;
        }
    
        // Find the highest current customer ID in localStorage
        let highestId = 0; // Start with 0 to ensure that IDs increment from 1 if none exists
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedUser = JSON.parse(localStorage.getItem(key));
                if (storedUser && storedUser.id > highestId) {
                    highestId = storedUser.id; // Update the highest ID found
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }
    
        // Increment the highest ID by 1 for the new customer
        const newCustomerId = highestId + 1;
    
        // Create a new customer object and store it in localStorage
        const newCustomer = { id: newCustomerId, name, email, password };
        localStorage.setItem(newCustomerId.toString(), JSON.stringify(newCustomer));
    
        alert('Customer registered successfully!');
        fetchCustomers(); // Refresh customer list after registration
    }

    // Function to create the Register Admin form
    function createRegisterAdminForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        // Create the register admin form
        const form = document.createElement('form');
        form.id = 'register-admin-form';
        form.innerHTML = `
            <h2>Register New Admin</h2>
            <div class="form-group">
                <label for="admin-name">Name</label>
                <input type="text" id="admin-name" required>
            </div>
            <div class="form-group">
                <label for="admin-email">Email</label>
                <input type="email" id="admin-email" required>
                <div id="register-admin-error" class="error-message"></div>
            </div>
            <div class="form-group">
                <label for="admin-password">Password</label>
                <input type="password" id="admin-password" required>
            </div>
            <div class="form-group">
                <label for="admin-confirm-password">Confirm Password</label>
                <input type="password" id="admin-confirm-password" required>
                <div id="register-admin-password-error" class="error-message"></div>
            </div>
            <button type="submit" class="admin-register-btn">Register Admin</button>
        `;

        mainContent.appendChild(form);

        // Set up form submission handler
        form.addEventListener('submit', handleRegisterAdmin);
    }

    // Handle admin registration logic
    function handleRegisterAdmin(event) {
        event.preventDefault();

        const name = document.getElementById('admin-name').value;
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const confirmPassword = document.getElementById('admin-confirm-password').value;
        const registerError = document.getElementById('register-admin-error');
        const passwordError = document.getElementById('register-admin-password-error');

        // Reset any previous error messages
        registerError.textContent = '';
        passwordError.textContent = '';

        if (password !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match';
            return;
        }

        // Find the highest current admin ID in localStorage
        let highestId = 0; // Start with 0 to ensure that IDs increment from 1 if none exists
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedAdmin = JSON.parse(localStorage.getItem(key));
                if (storedAdmin && storedAdmin.id < 0 && storedAdmin.id < highestId) {
                    highestId = storedAdmin.id; // Update the highest ID found
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }

        // Increment the highest ID by 1 for the new admin (ensure negative ID for admins)
        const newAdminId = -(Math.abs(highestId) + 1); // Use a negative ID for admins

        // Create a new admin object and store it in localStorage
        const newAdmin = { id: newAdminId, name, email, password };
        localStorage.setItem(newAdminId.toString(), JSON.stringify(newAdmin));

        alert('Admin registered successfully!');
        fetchAdmins(); // Refresh admin list after registration
    }
    
    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Remove user session data from localStorage
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('isAdminLoggedIn');

            // Redirect to the landing page after logout
            window.location.href = 'landing_page.html';
        });
    }
});
