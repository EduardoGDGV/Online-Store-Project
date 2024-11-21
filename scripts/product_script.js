// This function is executed when the window is loaded
window.onload = function () {
    // Get the product ID from the URL query string
    const productID = getProductIDFromURL();
    
    // If no product ID is found, display an error message and stop execution
    if (!productID) {
        document.body.innerHTML = '<p>Product not found. Please return to the main page.</p>';
        return;
    }

    // Retrieve the product from localStorage using the product ID
    const product = JSON.parse(localStorage.getItem(`product_${productID}`));
    
    // If the product is not found in localStorage, display an error message and stop execution
    if (!product) {
        document.body.innerHTML = '<p>Product not found in local storage.</p>';
        return;
    }

    // Display the product details on the page
    displayProductDetails(product);
};

// This function retrieves the product ID from the URL query string
function getProductIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// This function displays the product details on the product page
function displayProductDetails(product) {
    const mainContent = document.querySelector('.product-page-content');
    const loadIcon = document.getElementById('loader');

    // Check if the main content container exists, if not, show an error message
    if (!mainContent) {
        console.error('Error: .product-page-content element not found.');
        document.body.innerHTML = '<p>An error occurred. Please try again later.</p>';
        return;
    }

    // Get the cart data from localStorage or initialize as empty if no cart is found
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    // Initialize the "Add to Cart" button HTML
    let addToCartButtonHtml = `
        <button class="add-to-cart-btn">Add to Cart</button>
    `;

    // Initialize the quantity buttons HTML (will only show if the product is already in the cart)
    let quantityButtonsHtml = '';

    // If the product is already in the cart, show quantity buttons instead of the "Add to Cart" button
    if (existingProduct) {
        quantityButtonsHtml = `
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${product.id}, -1)">-</button>
                <span>${existingProduct.quantity}</span>
                <button onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
        `;
        // Hide the "Add to Cart" button
        addToCartButtonHtml = '';
    }

    // Insert the product details HTML into the main content
    mainContent.innerHTML = `
        <!-- Top Info Section with Side-by-Side Layout -->
        <div class="product-top">
            <div class="product-image">
                <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="producer">${product.producer}</p>
                <div class="rating">
                    <span class="stars">☆☆☆☆☆</span>
                    <span class="rating-number">0.0</span>
                    <span class="reviews">(0 reviews)</span>
                </div>
                <p class="price">R$ ${Number(product.price).toFixed(2)}</p>
                        
                <!-- Add to Cart and Quantity Buttons -->
                ${addToCartButtonHtml}
                ${quantityButtonsHtml}
            </div>
        </div>

        <!-- Description Section -->
        <div class="product-description">
            <h5>Description</h5>
            <p>${product.description || 'No description available.'}</p>
        </div>

        <!-- Reviews Section -->
        <div class="product-reviews">
            <h5>Reviews</h5>
            <p>No reviews yet.</p>
        </div>
    `;

    // If the product is not already in the cart, add event listener to "Add to Cart" button
    if (!existingProduct) {
        const addToCartBtn = mainContent.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            // Add the "Add to Cart" functionality when the button is clicked
            addToCartBtn.addEventListener('click', () => addToCart(product.id));
        }
    }

    // Hide the loading icon once the content has been loaded
    loadIcon.style.display = 'none';
}

// This function adds the product to the cart in localStorage
function addToCart(productID) {
    // Get the cart data from localStorage or initialize as empty if no cart is found
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Retrieve the product data from localStorage using the product ID
    const product = JSON.parse(localStorage.getItem(`product_${productID}`));

    // If the product is not found, log an error and stop execution
    if (!product) {
        console.error(`Product ${productID} not found in localStorage.`);
        return;
    }

    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    // If the product exists, increase the quantity by 1
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        // If the product doesn't exist, add it to the cart with quantity 1
        const productWithQuantity = { ...product, quantity: 1 };
        cart.push(productWithQuantity);
    }

    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the product details page
    displayProductDetails(product);
}

// This function updates the quantity of the product in the cart
function updateQuantity(productID, change) {
    // Get the cart data from localStorage or initialize as empty if no cart is found
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart
    const product = cart.find((item) => item.id === productID);

    // If the product is not in the cart, return early
    if (!product) return;

    // Update the product quantity, ensuring it doesn't go below 0
    product.quantity = Math.max(0, product.quantity + change);

    // If the quantity is 0, remove the product from the cart
    if (product.quantity === 0) {
        cart = cart.filter((item) => item.id !== productID);
    }

    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the product details page
    const productDetails = JSON.parse(localStorage.getItem(`product_${productID}`));
    displayProductDetails(productDetails);
}
