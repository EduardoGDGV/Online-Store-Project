window.onload = function () {
    // Check if there is a logged-in user in localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // If no user is logged in, redirect to the login page
    if (!loggedInUser) {
        window.location.href = 'login_page.html';
        return; // Stop further execution
    }

    displayProducts();
};

function displayProducts() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = ''; // Clear any existing content

    // Array to hold products found in localStorage
    const products = [];

    // Loop through localStorage to get products
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('product_')) {
            try {
                const product = JSON.parse(localStorage.getItem(key));
                if (product && product.name && product.price && product.image) {
                    products.push(product);
                }
            } catch (error) {
                console.warn(`Error parsing product at key ${key}:`, error);
            }
        }
    }

    // Display up to four products
    products.slice(0, 4).forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.description || 'No description available.'}</p>
            <button>Buy R$ ${Number(product.price).toFixed(2)}</button>
        `;

        mainContent.appendChild(productCard);
    });

    // If no products found, display a message
    if (products.length === 0) {
        mainContent.innerHTML = '<p>No products available at the moment.</p>';
    }
}
