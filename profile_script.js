window.onload = function () {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const loader = document.querySelector('.loader');
    const profileSection = document.querySelector('.profile-box');

    if (!loggedInUser) {
        window.location.href = 'login_page.html';
        return;
    }

    displayProfileContent();

    async function fetchUserProfile() {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${loggedInUser.id}`);
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    async function displayProfileContent() {
        loader.style.display = 'block'; // Show loader
        const user = await fetchUserProfile();

        if (!user) {
            alert('User data could not be loaded.');
            return;
        }

        const { street = 'N/A', city = 'N/A', state = 'N/A', zip = 'N/A', country = 'N/A' } = user.address || {};

        profileSection.innerHTML = `
            <h2>My Profile</h2>
            <div id="profile-info-display">
                <img src="${user.profilePic || 'http://localhost:5000/images/default_placeholder.png'}" alt="Profile Picture" class="profile-pic">
                <p><strong>Name:</strong> <span id="display-name">${user.name || 'N/A'}</span></p>
                <p><strong>Email:</strong> <span id="display-email">${user.email || 'N/A'}</span></p>
                <p><strong>Address:</strong></p>
                <ul>
                    <li>Street: <span id="display-street">${street || 'N/A'}</span></li>
                    <li>City: <span id="display-city">${city || 'N/A'}</span></li>
                    <li>State: <span id="display-state">${state || 'N/A'}</span></li>
                    <li>ZIP: <span id="display-zip">${zip || 'N/A'}</span></li>
                    <li>Country: <span id="display-country">${country || 'N/A'}</span></li>
                </ul>
                <p><strong>Phone Number:</strong> <span id="display-number">${user.phone || 'N/A'}</span></p>
            </div>
            <div class="button-group">
                <button id="edit-profile-btn" class="edit-btn">Edit Profile</button>
                <button id="logout" class="logout">Logout</button>
            </div>
        `;

        loader.style.display = 'none'; // Hide loader after content is loaded

        document.getElementById('edit-profile-btn').addEventListener('click', displayEditForm);
        document.getElementById('logout').addEventListener('click', logoutUser);
    }

    async function displayEditForm() {
        const user = await fetchUserProfile();
        const { street = '', city = '', state = '', zip = '', country = '' } = user.address || {};

        profileSection.innerHTML = `
            <h2>Edit Profile</h2>
            <form id="profile-form">
                <div class="form-group">
                    <label for="profilePic">Profile Picture</label>
                    <input type="file" id="profilePic">
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${user.name}">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="${user.email}">
                </div>
                <div class="form-group">
                    <label for="street">Street</label>
                    <input type="text" id="street" value="${street}">
                </div>
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" value="${city}">
                </div>
                <div class="form-group">
                    <label for="state">State</label>
                    <input type="text" id="state" value="${state}">
                </div>
                <div class="form-group">
                    <label for="country">Country</label>
                    <input type="text" id="country" value="${country}">
                </div>
                <div class="form-group">
                    <label for="zip">ZIP Code</label>
                    <input type="text" id="zip" value="${zip}">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" value="${user.phone || ''}">
                </div>
                <div class="button-group">
                    <button type="button" class="save-btn">Save Changes</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `;

        document.querySelector('.save-btn').addEventListener('click', saveChanges);
        document.querySelector('.cancel-btn').addEventListener('click', displayProfileContent);
    }

    async function saveChanges() {
        const formData = new FormData();
    
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
    
        // Append address fields
        formData.append('address', JSON.stringify({
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
        }));
    
        // Check if a new profile picture was uploaded
        const profilePicInput = document.getElementById('profilePic');
        if (profilePicInput.files.length > 0) {
            formData.append('profilePic', profilePicInput.files[0]); // Append the file
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/users/${loggedInUser.id}`, {
                method: 'PUT',
                body: formData, // Send the form data as the body
            });
    
            if (response.ok) {
                // Update sessionStorage with the updated user data
                sessionStorage.setItem('loggedInUser', JSON.stringify({
                    ...loggedInUser,
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: JSON.parse(formData.get('address')), // Parse address back to object
                }));
    
                alert('Profile updated successfully');
                displayProfileContent(); // Re-display the profile page
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile changes:', error);
        }
    }    

    function logoutUser() {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'landing_page.html';
    }
};