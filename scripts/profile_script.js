window.onload = function () {
    // Check if the user is logged in by checking session (or localStorage for simplicity)
    const loggedInUserId = localStorage.getItem('loggedInUserId');  // Save user ID in localStorage after login

    // If no user is logged in, redirect to the landing page
    if (!loggedInUserId && !isAdminLoggedIn) {
        window.location.href = 'landing_page.html';
        return;
    }

    const profileSection = document.querySelector('.profile-box');
    displayProfileContent();

    // Fetch the user's profile from the database
    async function fetchUserProfile() {
        try {
            const response = await fetch(`/api/users/${loggedInUserId}`);
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    async function displayProfileContent() {
        const user = await fetchUserProfile();

        if (!user) {
            alert('User data could not be loaded.');
            return;
        }

        // Display profile with the user's data
        profileSection.innerHTML = `
            <h2>My Profile</h2>
            <div id="profile-info-display">
                <img src="${user.profilePic || ''}" alt="Profile Picture" class="profile-pic" width="100" height="100">
                <p><strong>Name:</strong> <span id="display-name">${user.name || 'N/A'}</span></p>
                <p><strong>Email:</strong> <span id="display-email">${user.email || 'N/A'}</span></p>
                <p><strong>Address:</strong> <span id="display-address">${user.address || 'N/A'}</span></p>
                <p><strong>Phone Number:</strong> <span id="display-number">${user.phone || 'N/A'}</span></p>
            </div>
            <div class="button-group">
                <button id="edit-profile-btn" class="edit-btn">Edit Profile</button>
                <button id="logout" class="logout">Logout</button>
            </div>
        `;

        // Attach event listeners to Edit and Logout buttons
        document.getElementById('edit-profile-btn').addEventListener('click', displayEditForm);
        document.getElementById('logout').addEventListener('click', logoutUser);

        const loadIcon = document.getElementById('loader');
        loadIcon.style.display = 'none';  // Hide loader
    }

    async function displayEditForm() {
        const user = await fetchUserProfile();

        if (!user) {
            alert('Unable to load user data for editing.');
            return;
        }

        profileSection.innerHTML = `
            <h2>Edit Profile</h2>
            <form id="profile-form">
                <div class="form-group">
                    <label for="profilePic">Profile Picture</label>
                    <input type="file" id="profilePic">
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" value="${user.name || ''}">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="${user.email || ''}">
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" value="${user.address || ''}">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password">
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

    async function saveChanges() {
        const user = await fetchUserProfile();

        if (!user) {
            alert('Unable to load user data for saving changes.');
            return;
        }

        // Retrieve values from the form inputs
        const profilePicInput = document.getElementById('profilePic').files[0];
        const updatedUser = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value || user.password, // Keep the old password if no new one
        };

        // If a new profile picture is selected, convert it to a base64 string
        if (profilePicInput) {
            const reader = new FileReader();
            reader.onloadend = async function () {
                updatedUser.profilePic = reader.result; // Base64 string of the image
                await updateProfile(updatedUser); // Send updated user data to the server
            };
            reader.readAsDataURL(profilePicInput); // Read the file as base64
        } else {
            updatedUser.profilePic = user.profilePic || 'default-placeholder.png';
            await updateProfile(updatedUser); // Send updated user data without the picture
        }

        // Reload the page to reflect changes
        window.location.reload();
    }

    async function updateProfile(updatedUser) {
        try {
            const response = await fetch(`/api/users/${loggedInUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                // Update localStorage to reflect changes (optional)
                localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }

    function logoutUser() {
        localStorage.removeItem('loggedInUserId');
        window.location.href = 'landing_page.html';
    }
};
