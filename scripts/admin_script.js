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

// Event listeners for Register buttons
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

// Fetch and display customers
viewCustomersBtn.addEventListener('click', function() {
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
});

// Fetch and display admins
viewAdminsBtn.addEventListener('click', function() {
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
});

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

// Logout functionality
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        // Remove user session data from localStorage
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('isAdminLoggedIn');

        // Redirect to the landing page after logout
        window.location.href = 'landing_page.html';
    });
}