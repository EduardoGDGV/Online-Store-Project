window.onload = function () {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const searchIcon = document.getElementById('search-icon');
    const searchBarContainer = document.getElementById('search-bar-container');

    if (!loggedInUser) {
        window.location.href = 'login_page.html';
        return;
    }

    displayProducts();

    searchIcon.addEventListener('click', function (event) {
        event.preventDefault();
        searchBarContainer.classList.toggle('show-search-bar');
    });
};

function displayProducts() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = '';

    const products = [];

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

    products.slice(0, 4).forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${product.description || 'No description available.'}</p>
            <button class="buy-btn">Buy R$ ${Number(product.price).toFixed(2)}</button>
        `;

        mainContent.appendChild(productCard);

        // Add event listener to the "Buy" button
        productCard.querySelector('.buy-btn').addEventListener('click', () => addToCart(product));
    });

    if (products.length === 0) {
        mainContent.innerHTML = '<p>No products available at the moment.</p>';
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        product.quantity = 1; // Set initial quantity
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to the cart.`);
}
