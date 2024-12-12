// This function is executed when the window is loaded
window.onload = function () {
    // Fetch the product data from the backend using the product ID
    fetchProductData();
};

// Function to fetch product details from the server (MongoDB)
async function fetchProductData() {
    // Get the product ID from sessionStorage
    const productID = sessionStorage.getItem('productId');

    // If no product ID is found, display an error message and stop execution
    if (!productID) {
        document.body.innerHTML = '<p>Product not found. Please return to the main page.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/products/${productID}`);
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

    if (!mainContent) {
        console.error('Error: .product-page-content element not found.');
        document.body.innerHTML = '<p>An error occurred. Please try again later.</p>';
        return;
    }

    fetchCartData().then(cart => {
        let existingProduct = null;
        if(cart.items){
            // Ensure `cart.items` is an array and use optional chaining to avoid errors
            existingProduct = cart.items?.find((item) => item?.product?._id === product._id);
        }

        let addToCartButtonHtml = '';
        let quantityButtonsHtml = '';
        if (!existingProduct || existingProduct.quantity <= 0) {
            // If the product is not in the cart or quantity is zero, show "Add to Cart" button
            addToCartButtonHtml = `
                <button class="add-to-cart-btn">Add to Cart</button>
            `;
        } else {
            // If the product is in the cart, show quantity buttons
            quantityButtonsHtml = `
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(-1)">-</button>
                    <span>${existingProduct.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(1)">+</button>
                </div>
            `;
        }
    
        mainContent.innerHTML = `
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
                    ${addToCartButtonHtml}
                    ${quantityButtonsHtml}
                </div>
            </div>
            <div class="product-description">
                <h5>Description</h5>
                <p>${product.description || 'No description available.'}</p>
            </div>
            <div class="product-reviews">
                <h5>Reviews</h5>
                <p>No reviews yet.</p>
            </div>
        `;
    
        if (!existingProduct || existingProduct.quantity <= 0) {
            const addToCartBtn = mainContent.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent triggering the card's click event
                    addToCart();
                });
            }
        }
    
        loadIcon.style.display = 'none';
    });    
}

// Fetch cart data (from your backend)
async function fetchCartData() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (!loggedInUser || !loggedInUser.id) {
        alert('User not logged in. Redirecting to login page...');
        window.location.href = 'login_page.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`);
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

// Add product to cart
async function addToCart() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    // Get the product ID from sessionStorage
    const productID = sessionStorage.getItem('productId');

    if (!loggedInUser || !loggedInUser.id) {
        alert('User not logged in. Redirecting to login page...');
        window.location.href = 'login_page.html';
        return;
    }

    // If no product ID is found, display an error message and stop execution
    if (!productID) {
        document.body.innerHTML = '<p>Product not found. Please return to the main page.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productID, quantity: 1 }),
        });

        const cart = await response.json();

        const response2 = await fetch(`http://localhost:5000/api/products/${productID}`);
        const product = await response2.json();

        if (response.ok) {
            displayProductDetails(product);
        } else {
            console.error('Error adding product to cart:', cart.message);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Function to update the quantity of a product in the cart
async function updateQuantity(change) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    // Get the product ID from sessionStorage
    const productId = sessionStorage.getItem('productId');

    if (!loggedInUser || !loggedInUser.id) {
        alert('User not logged in. Redirecting to login page...');
        window.location.href = 'login_page.html';
        return;
    }

    // If no product ID is found, display an error message and stop execution
    if (!productId) {
        document.body.innerHTML = '<p>Product not found. Please return to the main page.</p>';
        return;
    }

    try {
        // Send the request to update the cart quantity
        const response = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId, // The product to update
                change      // The quantity change (positive or negative)
            }),
        });

        if (response.ok) {
            const updatedCart = await response.json();
            console.log('Cart updated:', updatedCart);
            fetchProductData(productId);
        } else {
            console.error('Error updating cart:', await response.text());
            alert('Failed to update cart quantity.');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('An error occurred while updating the cart.');
    }
}
