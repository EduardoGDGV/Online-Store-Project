window.onload = function () {
    const shopNowButton = document.querySelector('.btn'); // Selects the "Shop Now" button

    shopNowButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Check for both regular user and admin login status
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (isAdminLoggedIn) {
            // Redirect to admin page if an admin is logged in
            window.location.href = 'admin_page.html';
        } else if (loggedInUser) {
            // Redirect to main page if a regular user is logged in
            window.location.href = 'main_page.html';
        } else {
            // Redirect to login page if no one is logged in
            window.location.href = 'login_page.html';
        }
    });
};
