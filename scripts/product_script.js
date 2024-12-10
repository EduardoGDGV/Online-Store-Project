// This function is executed when the window is loaded
window.onload = function () {
    // Get the product ID from the URL query string
    const productID = getProductIDFromURL();
    
    // If no product ID is found, display an error message and stop execution
    if (!productID) {
        document.body.innerHTML = '<p>Product not found. Please return to the main page.</p>';
        return;
    }

    // Fetch the product data from the backend using the product ID
    fetchProductData(productID);
};

// This function retrieves the product ID from the URL query string
function getProductIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Function to fetch product details from the server (MongoDB)
async function fetchProductData(productID) {
    try {
        const response = await fetch(`/api/products/${productID}`);
        const product = await response.json();

        if (response.ok) {
            // Display the product details on the page
            displayProductDetails(product);
        } else {
            document.body.innerHTML = `<p>${product.message || 'Product not found.'}</p>`;
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        document.body.innerHTML = '<p>Unable to load product data. Please try again later.</p>';
    }
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

    // Get the cart data from the backend (MongoDB)
    fetchCartData().then(cart => {
        // Check if the product is already in the cart
        const existingProduct = cart.items.find((item) => item.product._id === product._id);

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
                    <button onclick="updateQuantity(${product._id}, -1)">-</button>
                    <span>${existingProduct.quantity}</span>
                    <button onclick="updateQuantity(${product._id}, 1)">+</button>
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
                addToCartBtn.addEventListener('click', () => addToCart(product._id));
            }
        }

        // Hide the loading icon once the content has been loaded
        loadIcon.style.display = 'none';
    });
}

// Function to fetch cart data from the backend
async function fetchCartData() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();

        if (response.ok) {
            return cart;
        } else {
            console.error('Error fetching cart data:', cart.message);
            return { items: [] };
        }
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return { items: [] };
    }
}

// This function adds the product to the cart via an API request
async function addToCart(productID) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productID, quantity: 1 }),
        });

        const cart = await response.json();

        if (response.ok) {
            // Re-render the product details page with updated cart
            displayProductDetails(cart.product);
        } else {
            console.error('Error adding product to cart:', cart.message);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// This function updates the quantity of the product in the cart via an API request
async function updateQuantity(productID, change) {
    try {
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productID, quantityChange: change }),
        });

        const cart = await response.json();

        if (response.ok) {
            // Re-render the product details page with updated cart
            displayProductDetails(cart.product);
        } else {
            console.error('Error updating product quantity:', cart.message);
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}
