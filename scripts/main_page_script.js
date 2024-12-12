window.onload = async function () {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Parse user details
    const searchIcon = document.getElementById('search-icon');
    const searchBarContainer = document.getElementById('search-bar-container');

    if (!loggedInUser || !loggedInUser.id) {
        window.location.href = 'login_page.html';
        return;
    }

    // Fetch and display products
    await displayProducts(loggedInUser.id);

    // Handle search bar toggle
    searchIcon.addEventListener('click', function (event) {
        event.preventDefault();
        searchBarContainer.classList.toggle('show-search-bar');
    });
};

// Function to fetch and display products from the server
async function displayProducts(userId) {
    const mainContent = document.querySelector('.main-content');
    const loadIcon = document.getElementById('loader');
    mainContent.innerHTML = ''; // Clear current products

    try {
        // Show loader
        loadIcon.style.display = 'block';

        // Fetch products from the server
        const productResponse = await fetch('http://localhost:5000/api/products');
        if (!productResponse.ok) throw new Error('Failed to fetch products.');

        const products = await productResponse.json();

        // Fetch the user's cart
        const cartResponse = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!cartResponse.ok) throw new Error('Failed to fetch cart.');

        const cart = await cartResponse.json();

        // Generate product cards
        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Check if the product is already in the user's cart
            const cartItem = cart.items.find((item) => item.product._id === product._id);

            let addToCartButtonHtml = '';
            let quantityButtonsHtml = '';

            if (!cartItem) {
                // If the product is not in the cart, show "Add to Cart" button
                addToCartButtonHtml = `
                    <button class="add-to-cart-btn">Add to Cart</button>
                `;
            } else if(cartItem.quantity <= 0){
                // If the product is not in the cart, show "Add to Cart" button
                addToCartButtonHtml = `
                    <button class="add-to-cart-btn">Add to Cart</button>
                `;
            } else {
                // If the product is in the cart, show quantity buttons
                quantityButtonsHtml = `
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity('${product._id}', -1)">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity('${product._id}', 1)">+</button>
                    </div>
                `;
            }

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="head">
                        <h4>${product.name}</h4>
                        <button class="heart-btn">
                            <span class="heart-icon">&#9825;</span>
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

            // Add event listener for "Add to Cart" button
            if (!cartItem) {
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent triggering the card's click event
                    addToCart(product, userId);
                });
            } else if(cartItem.quantity <= 0){
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent triggering the card's click event
                    addToCart(product, userId);
                });
            }else{
                // Add event listener for quantity buttons
                const quantityButtons = productCard.querySelectorAll('.quantity-btn');
                quantityButtons.forEach(button => {
                    button.addEventListener('click', function (event) {
                        event.stopPropagation(); // Prevent triggering the card's click event
                        
                        const action = this.getAttribute('data-action'); // Get the action (increase or decrease)
                        const productId = this.getAttribute('data-product-id'); // Get the product ID
                        
                        // Update cart quantity based on the action
                        if (action === 'increase') {
                            updateCartQuantity(productId, 1); // Increase quantity
                        } else if (action === 'decrease') {
                            updateCartQuantity(productId, -1); // Decrease quantity
                        }
                    });
                });
            }

            // Heart button functionality
            const heartButton = productCard.querySelector('.heart-btn');
            heartButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent triggering the card's click event
                const heartIcon = this.querySelector('.heart-icon');
                heartIcon.classList.toggle('filled');
                heartIcon.innerHTML = heartIcon.classList.contains('filled') ? '&#9829;' : '&#9825;';
            });

            // Add a click event listener to the entire product card to redirect to the product's page
            productCard.addEventListener('click', function () {
                if (event.target.closest('.add-to-cart-btn') || event.target.closest('.heart-btn') || event.target.closest('quantity-btn')) {
                    return; // Skip redirection for these elements
                }
                // Store the product ID in sessionStorage
                sessionStorage.setItem('productId', product._id);
                window.location.href = 'product_page.html';
            });
        });

        if (products.length === 0) {
            mainContent.innerHTML = '<p>No products available at the moment.</p>';
        }

        // Hide the loader after the products are loaded
        loadIcon.style.display = 'none';
    } catch (error) {
        console.error('Error fetching products or cart:', error);
        mainContent.innerHTML = '<p>Error loading products. Please try again later.</p>';
        loadIcon.style.display = 'none';
    }
}


// Function to add a product to the user's cart
async function addToCart(product, userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: product._id,
                quantity: 1,
            }),
        });

        if (response.ok) {
            const updatedCart = await response.json();
            console.log('Cart updated:', updatedCart);
            await displayProducts(userId); // Refresh products to reflect cart changes
        } else {
            console.error('Error adding product to cart:', await response.text());
            alert('Failed to add product to cart.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('An error occurred while adding to the cart.');
    }
}

// Function to update the quantity of a product in the cart
async function updateCartQuantity(productId, change) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (!loggedInUser || !loggedInUser.id) {
        alert('User not logged in. Redirecting to login page...');
        window.location.href = 'login_page.html';
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

            // Re-fetch and display products to reflect updated cart state
            await displayProducts(loggedInUser.id);
        } else {
            console.error('Error updating cart:', await response.text());
            alert('Failed to update cart quantity.');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('An error occurred while updating the cart.');
    }
}