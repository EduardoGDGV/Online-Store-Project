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

    // Fetch products from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('product_')) {
            try {
                const product = JSON.parse(localStorage.getItem(key));
                if (product && product.name && product.producer && product.price && product.image) {
                    products.push(product);
                }
            } catch (error) {
                console.warn(`Error parsing product at key ${key}:`, error);
            }
        }
    }

    // Generate product cards
    products.slice(0, 4).forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Check if the product is already in the cart
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);

        let addToCartButtonHtml = `
            <button class="add-to-cart-btn">Add to Cart</button>
        `;

        let quantityButtonsHtml = '';

        if (existingProduct) {
            // If the product is already in the cart, display quantity buttons
            quantityButtonsHtml = `
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${product.id}, -1)">-</button>
                    <span>${existingProduct.quantity}</span>
                    <button onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
            `;
            addToCartButtonHtml = ''; // Remove "Add to Cart" button
        }

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="head">
                    <h4>${product.name}</h4>
                    <button class="heart-btn">
                        <span class="heart-icon">&#9825;</span> <!-- Initial empty heart -->
                    </button>
                </div>
                <p class="producer">${product.producer}</p>
                <p class="description">${product.description || 'No description available.'}</p>
                <div class="rating">
                    <span class="stars">☆☆☆☆☆</span>
                    <span class="rating-number">0.0</span>
                    <span class="reviews">(0 reviews)</span>
                </div>
                <p class="price">R$ ${Number(product.price).toFixed(2)}</p>
                ${addToCartButtonHtml}
                ${quantityButtonsHtml}
            </div>
        `;

        mainContent.appendChild(productCard);

        // Event listener for "Add to Cart" button
        if (!existingProduct) {
            productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.id));
        }

        // Heart button functionality
        const heartButton = productCard.querySelector('.heart-btn');
        heartButton.addEventListener('click', function () {
            const heartIcon = this.querySelector('.heart-icon');
            heartIcon.classList.toggle('filled');
            heartIcon.innerHTML = heartIcon.classList.contains('filled') ? '&#9829;' : '&#9825;';
        });
    });

    if (products.length === 0) {
        mainContent.innerHTML = '<p>No products available at the moment.</p>';
    }
}

function addToCart(productID) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve the cart or initialize as empty

    // Retrieve the product from localStorage using the product id
    const product = JSON.parse(localStorage.getItem(`product_${productID}`));

    // Check if the product exists
    if (!product) {
        console.error(`Product ${productID} not found in localStorage.`);
        return;
    }

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        // If the product exists, increase the quantity
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the cart, add it with an initial quantity of 1
        const productWithQuantity = { ...product, quantity: 1 };
        cart.push(productWithQuantity);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the main page with updated cart data (if needed, you can remove this line if unnecessary)
    displayProducts();
}

function updateQuantity(productID, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve the cart from localStorage

    const product = cart.find(item => item.id === productID);
    
    if (!product) return; // Ensure product exists in cart

    product.quantity = Math.max(0, product.quantity + change); // Update quantity, prevent negative

    if (product.quantity === 0) {
        // Remove product if quantity is zero
        cart = cart.filter(item => item.id !== productID);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the main page with updated cart data
    displayProducts();
}
