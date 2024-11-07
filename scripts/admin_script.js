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