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
    const viewProductsBtn = document.getElementById('view-products-btn');
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
            createRegisterProductForm();
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

    if (viewProductsBtn){
        viewProductsBtn.addEventListener('click', function() {
            createProductsTable();
        });
    }

    // Function to get the next available ID for a specific prefix
    function getNextId(prefix) {
        let highestId = 0; // Default ID to start from 0

        // Loop through all entries in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedItem = JSON.parse(localStorage.getItem(key));

                // Check if the key starts with the prefix and the ID is valid
                if (key.startsWith(prefix) && storedItem && storedItem.id) {
                    highestId = Math.max(highestId, storedItem.id); // Get the highest ID for that prefix
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }

        // Return the next available ID
        return highestId + 1;
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

    // Delete customer from localStorage
    function deleteCustomer(key) {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            localStorage.removeItem(key);
            fetchCustomers(); // Refresh customer list after deletion
        }
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

    // Delete admin from localStorage
    function deleteAdmin(key) {
        const confirmDelete = confirm('Are you sure you want to delete this admin?');
        if (confirmDelete) {
            localStorage.removeItem(key);
            fetchAdmins(); // Refresh admin list after deletion
        }
    }

    // Create and display the Products table
    function createProductsTable() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        const productsSection = document.createElement('div');
        productsSection.innerHTML = `
            <h2>Registered Products</h2>
            <table id="products-table">
                <thead>
                    <tr>
                        <th>Id</th>
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

    // Fetch and display products from localStorage
    function fetchProducts() {
        const productsBody = document.getElementById('products-body');
        productsBody.innerHTML = ''; // Clear previous content

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const storedProduct = JSON.parse(localStorage.getItem(key));
                if (storedProduct && key.startsWith('product_')) {
                    const row = document.createElement('tr');

                    // Id cell
                    const idCell = document.createElement('td');
                    idCell.textContent = storedProduct.id;
                    row.appendChild(idCell);

                    // Image cell
                    const imageCell = document.createElement('td');
                    if (storedProduct.image) {
                        const img = document.createElement('img');
                        img.src = storedProduct.image;
                        img.alt = storedProduct.name;
                        img.style.width = '50px'; // Thumbnail size
                        imageCell.appendChild(img);
                    }
                    row.appendChild(imageCell);

                    // Name cell
                    const nameCell = document.createElement('td');
                    nameCell.textContent = storedProduct.name;
                    row.appendChild(nameCell);

                    // Description cell with truncation
                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = storedProduct.description.slice(0, 50) + '...';
                    row.appendChild(descriptionCell);

                    // Producer cell
                    const producerCell = document.createElement('td');
                    producerCell.textContent = storedProduct.producer;
                    row.appendChild(producerCell);

                    // Price cell
                    const priceCell = document.createElement('td');
                    priceCell.textContent = `$${storedProduct.price.toFixed(2)}`;
                    row.appendChild(priceCell);

                    // Stock cell
                    const stockCell = document.createElement('td');
                    stockCell.textContent = storedProduct.stock;
                    row.appendChild(stockCell);

                    // Verified cell
                    const verifiedCell = document.createElement('td');
                    verifiedCell.textContent = storedProduct.verified ? 'Yes' : 'No';
                    row.appendChild(verifiedCell);

                    // Action cell
                    const actionCell = document.createElement('td');
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-btn');
                    deleteButton.setAttribute('data-id', key);
                    deleteButton.addEventListener('click', () => deleteProduct(key));
                    actionCell.appendChild(deleteButton);
                    row.appendChild(actionCell);

                    productsBody.appendChild(row);
                }
            } catch (error) {
                console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
            }
        }
    }

    // Delete product from localStorage
    function deleteProduct(key) {
        const confirmDelete = confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            localStorage.removeItem(key);
            fetchProducts(); // Refresh product list after deletion
        }
    }

    // Function to create the Register Product form
    function createRegisterProductForm() {
        const mainContent = document.getElementById('admin-content');
        mainContent.innerHTML = ''; // Clear current content

        // Create the register product form
        const form = document.createElement('form');
        form.id = 'register-product-form';
        form.innerHTML = `
            <h2>Register New Product</h2>
            <div class="form-group">
                <label for="product-name">Name</label>
                <input type="text" id="product-name" required>
            </div>
            <div class="form-group">
                <label for="product-description">Description</label>
                <textarea id="product-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="product-producer">Producer</label>
                <input type="text" id="product-producer" required>
            </div>
            <div class="form-group">
                <label for="product-price">Price</label>
                <input type="number" id="product-price" required step="0.01">
            </div>
            <div class="form-group">
                <label for="product-stock">Amount in Stock</label>
                <input type="number" id="product-stock" required>
            </div>
            <div class="form-group">
                <label for="product-verified">Verified</label>
                <input type="checkbox" id="product-verified">
            </div>
            <div class="form-group">
                <label for="product-image">Product Image</label>
                <input type="file" id="product-image" accept="image/*">
            </div>
            <button type="submit" class="admin-register-btn">Register Product</button>
        `;

        mainContent.appendChild(form);

        // Set up form submission handler
        form.addEventListener('submit', handleRegisterProduct);
    }

    // Handle product registration logic
    function handleRegisterProduct(event) {
        event.preventDefault();

        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const producer = document.getElementById('product-producer').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const verified = document.getElementById('product-verified').checked;
        const imageFile = document.getElementById('product-image').files[0];  // Get the uploaded image file

        // Reset any previous error messages
        const productError = document.getElementById('register-product-error');
        if (productError) {
            productError.textContent = '';
        }

        if (!name || !description || !producer || isNaN(price) || isNaN(stock)) {
            productError.textContent = 'Please fill in all the fields correctly.';
            return;
        }

        // Handle image upload if a file is provided
        let productImageUrl = '';
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                // After the file is loaded, we can set the image URL for the product
                productImageUrl = reader.result;  // This is a base64 string representing the image
                registerProduct(productImageUrl);
            };
            reader.readAsDataURL(imageFile);  // Convert the image file to base64 string
        } else {
            // No image provided, proceed with registration without image
            registerProduct('');
        }

        function registerProduct(imageUrl) {
            // Get the next available product ID
            const newProductId = getNextId('product_');

            // Create a new product object and store it in localStorage with the 'product_' prefix
            const newProduct = {
                id: newProductId,
                name,
                description,
                producer,
                price,
                stock,
                verified,
                image: imageUrl  // Store the image URL or empty string if no image was uploaded
            };

            localStorage.setItem(`product_${newProductId}`, JSON.stringify(newProduct));

            alert('Product registered successfully!');
            // Optionally, refresh or show the list of products
        }
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

        // Get the next available admin ID (Negative IDs for admins)
        const newAdminId = -getNextId('admin_'); // Negative ID for admins

        // Create a new admin object and store it in localStorage with the 'admin_' prefix
        const newAdmin = { id: newAdminId, name, email, password };
        localStorage.setItem(`admin_${Math.abs(newAdminId)}`, JSON.stringify(newAdmin));

        alert('Admin registered successfully!');
        fetchAdmins(); // Refresh admin list after registration
    }

    // Function to create the Register Customer form
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
                <div id="register-customer-password-error" class="error-message"></div>
            </div>
            <button type="submit" class="admin-register-btn">Register Customer</button>
        `;

        mainContent.appendChild(form);

        // Set up form submission handler
        form.addEventListener('submit', handleRegisterCustomer);
    }

    // Handle customer registration logic
    function handleRegisterCustomer(event) {
        event.preventDefault();

        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;
        const confirmPassword = document.getElementById('customer-confirm-password').value;
        const registerError = document.getElementById('register-customer-error');
        const passwordError = document.getElementById('register-customer-password-error');

        // Reset any previous error messages
        registerError.textContent = '';
        passwordError.textContent = '';

        if (password !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match';
            return;
        }

        // Get the next available customer ID
        const newCustomerId = getNextId('user_');

        // Create a new customer object and store it in localStorage with the 'user_' prefix
        const newCustomer = { id: newCustomerId, name, email, password };
        localStorage.setItem(`user_${newCustomerId}`, JSON.stringify(newCustomer));

        alert('Customer registered successfully!');
    }

    // Log out logic
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isAdminLoggedIn');
            window.location.href = 'login_page.html'; // Redirect to login page
        });
    }

});
