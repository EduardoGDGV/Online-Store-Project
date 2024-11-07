window.onload = function () {
    // Check if there is a logged-in user in localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // If no user is logged in, redirect to the login page
    if (!loggedInUser) {
        window.location.href = 'login_page.html';
    }
};
