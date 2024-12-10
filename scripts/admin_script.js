// Event listeners for Register buttons
document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (window.location.pathname.endsWith('admin_page.html')) {
        if (!loggedInUser || loggedInUser.role !== 'admin') {
            window.location.href = 'landing_page.html'; // Redirect to login if not logged in or not an admin
        }
    }

    const registerAdmin = document.getElementById('register-admin');
    const registerCustomer = document.getElementById('register-customer');
    const registerProduct = document.getElementById('register-product');
    const viewCustomersBtn = document.getElementById('view-customers-btn');
    const viewAdminsBtn = document.getElementById('view-admins-btn');
    const viewProductsBtn = document.getElementById('view-products-btn');
    const logoutButton = document.getElementById('logout');

    if (registerAdmin) {
        registerAdmin.addEventListener('click', function () {
            createRegisterAdminForm();
        });
    }

    if (registerCustomer) {
        registerCustomer.addEventListener('click', function () {
            createRegisterCustomerForm();
        });
    }

    if (registerProduct) {
        registerProduct.addEventListener('click', function () {
            createRegisterProductForm();
        });
    }

    if (viewCustomersBtn) {
        viewCustomersBtn.addEventListener('click', function () {
            createCustomerTable(); // Fetch customers from MongoDB
        });
    }

    if (viewAdminsBtn) {
        viewAdminsBtn.addEventListener('click', function () {
            createAdminsTable(); // Fetch admins from MongoDB
        });
    }

    if (viewProductsBtn) {
        viewProductsBtn.addEventListener('click', function () {
            createProductsTable(); // Fetch products from MongoDB
        });
    }

    // Log out logic
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'landing_page.html'; // Redirect to landing page
        });
    }

    // Fetch and display customers
    function createCustomerTable() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = '';

        const customersSection = document.createElement('div');
        customersSection.innerHTML = `
            <h2>Registered Customers</h2>
            <table id="customers-table">
                <thead>
                    <tr>
                        <th>Profile Picture</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="customers-body"></tbody>
            </table>
        `;
        mainContent.appendChild(customersSection);
        fetchCustomers();
    }

    async function fetchCustomers() {
        const customersBody = document.getElementById('customers-body');
        customersBody.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch('http://localhost:5000/api/users/customers');
            const customers = await response.json();
            if (Array.isArray(customers)) {
                customers.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${customer.profilePic || 'default-placeholder.png'}" alt="Profile Picture" width="50" height="50"></td>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>${customer.address || ''}</td>
                        <td>${customer.phone || ''}</td>
                        <td>
                            <button class="delete-btn" data-id="${customer.id}">Delete</button>
                        </td>
                    `;
                    row.querySelector('.delete-btn').addEventListener('click', () => deleteCustomer(customer._id));
                    customersBody.appendChild(row);
                });
            } else {
                console.error('Received data is not an array', admins);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }

    async function deleteCustomer(id) {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchCustomers(); // Refresh customer list after deletion
                } else {
                    console.error('Failed to delete customer');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    }

    // Fetch and display admins
    function createAdminsTable() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = '';

        const adminsSection = document.createElement('div');
        adminsSection.innerHTML = `
            <h2>Registered Admins</h2>
            <table id="admins-table">
                <thead>
                    <tr>
                        <th>Profile Picture</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="admins-body"></tbody>
            </table>
        `;
        mainContent.appendChild(adminsSection);
        fetchAdmins();
    }

    async function fetchAdmins() {
        const adminsBody = document.getElementById('admins-body');
        adminsBody.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch('http://localhost:5000/api/users/admins');
            const admins = await response.json();

            if (Array.isArray(admins)) {
                admins.forEach(admin => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${admin.profilePic || 'default-placeholder.png'}" alt="Profile Picture" width="50" height="50"></td>
                        <td>${admin.name}</td>
                        <td>${admin.email}</td>
                        <td>${admin.address || ''}</td>
                        <td>${admin.phone || ''}</td>
                        <td>
                            <button class="delete-btn" data-id="${admin.id}" ${admin.email === 'admin@example.com' ? 'disabled' : ''}>
                                ${admin.email === 'admin@example.com' ? 'Cannot Delete' : 'Delete'}
                            </button>
                        </td>
                    `;
                    if (admin.email !== 'admin@example.com') {
                        row.querySelector('.delete-btn').addEventListener('click', () => deleteAdmin(admin._id));
                    }
                    adminsBody.appendChild(row);
                });
            } else {
                console.error('Received data is not an array', admins);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }

    async function deleteAdmin(id) {
        const confirmDelete = confirm('Are you sure you want to delete this admin?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchAdmins(); // Refresh admin list after deletion
                } else {
                    console.error('Failed to delete admin');
                }
            } catch (error) {
                console.error('Error deleting admin:', error);
            }
        }
    }

    // Fetch and display products
    function createProductsTable() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const productsSection = document.createElement('div');
        productsSection.innerHTML = `
            <h2>Registered Products</h2>
            <table id="products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Producer</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Verified</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="products-body"></tbody>
            </table>
        `;
        mainContent.appendChild(productsSection);
        fetchProducts(); // Populate product data
    }

    async function fetchProducts() {
        const productsBody = document.getElementById('products-body');
        productsBody.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch('http://localhost:5000/api/products');
            const products = await response.json();

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${product.image || 'default-placeholder.png'}" alt="Product Image" width="50" height="50"></td>
                    <td>${product.name}</td>
                    <td>${product.description.slice(0, 50)}...</td>
                    <td>${product.producer}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${product.verified ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="delete-btn" data-id="${product.id}">Delete</button>
                    </td>
                `;
                row.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product._id));
                productsBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function deleteProduct(id) {
        const confirmDelete = confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchProducts(); // Refresh product list after deletion
                } else {
                    console.error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    }

    // Create Register Admin Form
    function createRegisterAdminForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const form = document.createElement('form');
        form.id = 'register-admin-form';
        form.enctype = 'multipart/form-data'; // Set the form encoding type for file uploads
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
            <div class="form-group">
                <label for="admin-address">Address</label>
                <input type="text" id="admin-address">
            </div>
            <div class="form-group">
                <label for="admin-phone">Phone</label>
                <input type="text" id="admin-phone">
            </div>
            <div class="form-group">
                <label for="admin-profile-pic">Profile Picture</label>
                <input type="file" id="admin-profile-pic" accept="image/*">
            </div>
            <button type="submit" class="admin-register-btn">Register Admin</button>
        `;
        mainContent.appendChild(form);

        form.addEventListener('submit', handleRegisterAdmin);
    }

    // Handle Register Admin Form Submission
    async function handleRegisterAdmin(event) {
        event.preventDefault();

        const name = document.getElementById('admin-name').value;
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const confirmPassword = document.getElementById('admin-confirm-password').value;
        const address = document.getElementById('admin-address').value;
        const phone = document.getElementById('admin-phone').value;
        const profilePic = document.getElementById('admin-profile-pic').files[0]; // Get file input

        // Email existence check
        const emailExists = await checkIfEmailExists(email);
        if (emailExists) {
            document.getElementById('register-admin-password-error').textContent = "";
            document.getElementById('register-admin-error').textContent = "Email is already in use.";
            return;
        }

        // Password matching validation
        if (password !== confirmPassword) {
            document.getElementById('register-admin-error').textContent = "";
            document.getElementById('register-admin-password-error').textContent = "Passwords do not match.";
            return;
        }

        const formData = new FormData(); // Create FormData for multipart/form-data
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', 'admin');
        formData.append('confirmPassword', confirmPassword);
        formData.append('address', address || ''); // Default to empty if not provided
        formData.append('phone', phone || ''); // Default to empty if not provided
        if (profilePic) {
            formData.append('profilePic', profilePic); // Append file only if provided
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                body: formData // Use FormData for multipart form upload
            });

            if (response.ok) {
                document.getElementById('register-admin-error').textContent = "";
                document.getElementById('register-admin-password-error').textContent = "";
                alert('Admin registered successfully!');
                createRegisterAdminForm(); // Reset the form after submission
            } else {
                const errorData = await response.json();
                document.getElementById('register-admin-password-error').textContent = "";
                document.getElementById('register-admin-error').textContent = errorData.message || 'Registration failed.';
            }
        } catch (error) {
            console.error('Error registering admin:', error);
        }
    }

    // Create Register Customer Form
    function createRegisterCustomerForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const form = document.createElement('form');
        form.id = 'register-customer-form';
        form.enctype = 'multipart/form-data'; // Set the form encoding type for file uploads
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
                <div id="register-customer-password-error" class="error-message"></div>
            </div>
            <div class="form-group">
                <label for="customer-address">Address</label>
                <input type="text" id="customer-address">
            </div>
            <div class="form-group">
                <label for="customer-phone">Phone</label>
                <input type="text" id="customer-phone">
            </div>
            <div class="form-group">
                <label for="customer-profile-pic">Profile Picture</label>
                <input type="file" id="customer-profile-pic" accept="image/*">
            </div>
            <button type="submit" class="admin-register-btn">Register Customer</button>
        `;
        mainContent.appendChild(form);

        form.addEventListener('submit', handleRegisterCustomer);
    }    

    // Handle Register Customer Form Submission
    async function handleRegisterCustomer(event) {
        event.preventDefault();

        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;
        const confirmPassword = document.getElementById('customer-confirm-password').value;
        const address = document.getElementById('customer-address').value;
        const phone = document.getElementById('customer-phone').value;
        const profilePic = document.getElementById('customer-profile-pic').files[0]; // File input for profile picture

        // Validate required fields
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill out all required fields.');
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const formData = new FormData(); // Create FormData for multipart/form-data
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('address', address || ''); // Default to empty if not provided
        formData.append('phone', phone || ''); // Default to empty if not provided
        if (profilePic) {
            formData.append('profilePic', profilePic); // Append file only if provided
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                body: formData, // Send FormData
            });

            if (response.ok) {
                alert('Customer registered successfully!');
                createRegisterCustomerForm(); // Reset the form after submission
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'Customer registration failed.'));
            }
        } catch (error) {
            console.error('Error registering customer:', error);
            alert('An error occurred while registering the customer.');
        }
    }

    // Function to check if email already exists
    async function checkIfEmailExists(email) {
        try {
            const response = await fetch('http://localhost:5000/api/users/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            return data.exists; // Returns true if email exists, false otherwise
        } catch (error) {
            console.error('Error checking email:', error);
            return false; // Default to false if error occurs
        }
    }

    // Create Register Product Form
    function createRegisterProductForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const form = document.createElement('form');
        form.id = 'register-product-form';
        form.enctype = 'multipart/form-data'; // Set the form encoding type for file uploads
        form.innerHTML = `
            <h2>Register New Product</h2>
            <div class="form-group">
                <label for="product-name">Product Name</label>
                <input type="text" id="product-name" required>
            </div>
            <div class="form-group">
                <label for="product-description">Product Description</label>
                <input type="text" id="product-description" required>
            </div>
            <div class="form-group">
                <label for="product-producer">Product Producer</label>
                <input type="text" id="product-producer" required>
            </div>
            <div class="form-group">
                <label for="product-price">Product Price</label>
                <input type="number" id="product-price" required>
            </div>
            <div class="form-group">
                <label for="product-stock">Product Stock</label>
                <input type="number" id="product-stock" required>
            </div>
            <div class="form-group">
                <label for="product-verified">Product Verified</label>
                <input type="checkbox" id="product-verified">
            </div>
            <div class="form-group">
                <label for="product-pic">Product Picture</label>
                <input type="file" id="product-pic" accept="image/*" required>
            </div>
            <button type="submit" class="admin-register-btn">Register Product</button>
        `;
        mainContent.appendChild(form);

        form.addEventListener('submit', handleRegisterProduct);
    }

    // Handle Register Product Form Submission
    async function handleRegisterProduct(event) {
        event.preventDefault();

        const formData = new FormData(); // Use FormData for multipart/form-data
        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const price = document.getElementById('product-price').value;
        const stock = document.getElementById('product-stock').value;
        const producer = document.getElementById('product-producer').value;
        const verified = document.getElementById('product-verified').checked;
        const productPic = document.getElementById('product-pic').files[0];

        // Validate required fields
        if (!name || !description || !price || !stock || !producer || !productPic) {
            alert("Please fill out all required fields.");
            return;
        }

        // Append fields to FormData
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock));
        formData.append('producer', producer);
        formData.append('verified', verified);
        formData.append('image', productPic); // Append the file

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData // Send FormData
            });

            if (response.ok) {
                alert('Product registered successfully!');
                createRegisterProductForm(); // Reset the form after submission
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'Product registration failed.'));
            }
        } catch (error) {
            console.error('Error registering product:', error);
            alert('An error occurred while registering the product.');
        }
    }

});
