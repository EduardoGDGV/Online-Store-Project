window.onload = function () {
    // Retrieve logged-in user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser || !loggedInUser.id) {
        // Redirect to login page if no valid user is logged in
        window.location.href = 'login_page.html';
        return;
    }

    // Add event listener to the "Shop Now" button
    const shopNowButton = document.querySelector('.btn');
    shopNowButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Check if the user is an admin
        if (loggedInUser.role === 'admin') {
            window.location.href = 'admin_page.html'; // Redirect to admin page
        } else {
            window.location.href = 'main_page.html'; // Redirect to main page for regular users
        }
    });
};
