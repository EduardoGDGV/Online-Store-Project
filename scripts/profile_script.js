window.onload = function () {
    // Check if the user is logged in by checking localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

    // If no user is logged in, redirect to the landing page
    if (!loggedInUser && !isAdminLoggedIn) {
        window.location.href = 'landing_page.html';
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
};
