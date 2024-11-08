window.onload = function () {
    // Check if the user is logged in by checking localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Parse user data from JSON
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

    // If no user is logged in, redirect to the landing page
    if (!loggedInUser && !isAdminLoggedIn) {
        window.location.href = 'landing_page.html';
        return;
    }

    const profileSection = document.querySelector('.profile-box');
    displayProfileContent();

    function displayProfileContent() {
        // Display profile with the user's stored data
        profileSection.innerHTML = `
            <h2>My Profile</h2>
            <div id="profile-info-display">
                <img src="${loggedInUser.profilePic || ''}" alt="Profile Picture" class="profile-pic" width="100" height="100">
                <p><strong>Name:</strong> <span id="display-name">${loggedInUser.name || 'N/A'}</span></p>
                <p><strong>Email:</strong> <span id="display-email">${loggedInUser.email || 'N/A'}</span></p>
                <p><strong>Address:</strong> <span id="display-address">${loggedInUser.address || 'N/A'}</span></p>
                <p><strong>Phone Number:</strong> <span id="display-number">${loggedInUser.number || 'N/A'}</span></p>
            </div>
            <div class="button-group">
                <button id="edit-profile-btn" class="edit-btn">Edit Profile</button>
                <button id="logout" class="logout">Logout</button>
            </div>
        `;

        // Attach event listeners to Edit and Logout buttons
        document.getElementById('edit-profile-btn').addEventListener('click', displayEditForm);
        document.getElementById('logout').addEventListener('click', logoutUser);
    }

    function displayEditForm() {
        profileSection.innerHTML = `
            <h2>Edit Profile</h2>
            <form id="profile-form">
                <div class="form-group">
                    <label for="profilePic">Profile Picture</label>
                    <input type="file" id="profilePic">
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${loggedInUser.name || ''}">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="${loggedInUser.email || ''}">
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" value="${loggedInUser.address || ''}">
                </div>
                <div class="form-group">
                    <label for="number">Phone Number</label>
                    <input type="text" id="number" value="${loggedInUser.number || ''}">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" value="${loggedInUser.password || ''}">
                </div>
                <div class="button-group">
                    <button type="button" class="save-btn">Save Changes</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `;

        // Attach event listeners for save and cancel buttons
        document.querySelector('.save-btn').addEventListener('click', saveChanges);
        document.querySelector('.cancel-btn').addEventListener('click', displayProfileContent);
    }

    function saveChanges() {
        // Retrieve values from the input fields
        const profilePicInput = document.getElementById('profilePic').files[0];
        const updatedUser = {
            id: loggedInUser.id,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            number: document.getElementById('number').value,
            password: document.getElementById('password').value || loggedInUser.password, // Keep the old password if no new one is entered
        };

        // If a new profile picture is selected, convert it to a base64 string
        if (profilePicInput) {
            const reader = new FileReader();
            reader.onloadend = function () {
                updatedUser.profilePic = reader.result; // Set the profilePic to the base64 string
                updateProfile(updatedUser); // Update the profile with new picture
            };
            reader.readAsDataURL(profilePicInput); // Read the file as a base64 URL
        } else {
            updatedUser.profilePic = loggedInUser.profilePic || 'default-placeholder.png'; // Keep the old profile picture if no new one is selected
            updateProfile(updatedUser); // Update the profile without a new picture
        }

        // Reload the page to reflect the changes
        window.location.reload();
    }

    function updateProfile(updatedUser) {
        // Loop through all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
    
            // Check if the key starts with 'user_'
            if (key.startsWith('user_')) {
                try {
                    const storedUser = JSON.parse(localStorage.getItem(key));
    
                    // Debug: Log each item in localStorage with 'user_' prefix
                    console.log(`Key: ${key}, Value:`, storedUser);
    
                    // Find the user with the same ID as the logged-in user
                    if (storedUser && storedUser.id === updatedUser.id) {
                        // Debug: Log the matched user
                        console.log('Updating User:', storedUser);
    
                        // Update the user data
                        localStorage.setItem(key, JSON.stringify(updatedUser));
                        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                        break; // Stop once the user is found and updated
                    }
                } catch (error) {
                    console.warn(`Skipping non-JSON or invalid entry at key "${key}"`);
                }
            }
        }
    
        // Update the display content with the new profile data
        displayProfileContent();
    }    

    function logoutUser() {
        // Remove user session data from localStorage
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('isAdminLoggedIn');
        // Redirect to the landing page after logout
        window.location.href = 'landing_page.html';
    }
};
