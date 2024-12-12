window.onload = async function () {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Parse user details
    const searchIcon = document.getElementById('search-icon');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchBar = document.querySelector('.search-bar'); // Get the search input
    const favoriteIcon = document.getElementById('favorite-icon'); // Favorite icon element

    if (!loggedInUser || !loggedInUser.id) {
        window.location.href = 'login_page.html';
        return;
    }

    // Fetch and display products initially
    let allProducts = await fetchProducts();
    let favorites = await fetchFavorites(loggedInUser.id); // Fetch the user's favorites

    // Handle search bar toggle
    searchIcon.addEventListener('click', function (event) {
        event.preventDefault();
        searchBarContainer.classList.toggle('show-search-bar');
    });

    // Add event listener for search input
    searchBar.addEventListener('input', function () {
        const query = searchBar.value.toLowerCase(); // Get search query
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
        });
        displayProducts(filteredProducts, loggedInUser.id, favorites); // Display filtered products
    });

    // Initially display all products
    displayProducts(allProducts, loggedInUser.id, favorites);

    // Add event listener for favorite icon
    favoriteIcon.addEventListener('click', function (event) {
        // Filter products to show only favorites
        const favoriteProducts = allProducts.filter(product => favorites.includes(product._id));
        displayProducts(favoriteProducts, loggedInUser.id, favorites); // Display favorite products
    });
};

// Fetch and return all products
async function fetchProducts() {
    try {
        const productResponse = await fetch('http://localhost:5000/api/products');
        if (!productResponse.ok) throw new Error('Failed to fetch products.');
        return await productResponse.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchFavorites(userId) {
    try {
        const favoritesResponse = await fetch(`http://localhost:5000/api/users/favorites/${userId}`);
        if (!favoritesResponse.ok) throw new Error('Failed to fetch favorites.');
        const favorites = await favoritesResponse.json();
        return Array.isArray(favorites) ? favorites : []; // Ensure favorites is an array
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return []; // Return an empty array if there's an error
    }
}

async function displayProducts(products, userId, favorites) {
    const mainContent = document.querySelector('.main-content');
    const loadIcon = document.getElementById('loader');
    mainContent.innerHTML = ''; // Clear current products

    try {
        // Show loader
        loadIcon.style.display = 'block';

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
            } else {
                // If the product is in the cart, show quantity buttons
                quantityButtonsHtml = `
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(event, '${product._id}', -1)">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(event, '${product._id}', 1)">+</button>
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
                            <span class="heart-icon ${Array.isArray(favorites) && favorites.includes(product._id) ? 'filled' : ''}">
                                ${Array.isArray(favorites) && favorites.includes(product._id) ? '&#9829;' : '&#9825;'}
                            </span>
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
            }

            // Add event listener for heart button (Favorite functionality)
            const heartButton = productCard.querySelector('.heart-btn');
            heartButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent triggering the card's click event
                const heartIcon = this.querySelector('.heart-icon');
                const isFavorited = heartIcon.classList.contains('filled'); // Check if the heart is filled

                // Toggle favorite state
                if (isFavorited) {
                    heartIcon.classList.remove('filled'); // Remove the filled class
                    heartIcon.innerHTML = '&#9825;'; // Change to empty heart
                    removeFromFavorites(product._id, userId);
                } else {
                    heartIcon.classList.add('filled'); // Add the filled class
                    heartIcon.innerHTML = '&#9829;'; // Change to filled heart
                    addToFavorites(product._id, userId);
                }
            });

            // Add a click event listener to the entire product card to redirect to the product's page
            productCard.addEventListener('click', function () {
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

// Function to update the quantity of a product in the cart
async function updateCartQuantity(event, productId, change) {
    event.stopPropagation();  // Stop propagation to prevent triggering card's click event

    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (!loggedInUser || !loggedInUser.id) {
        alert('User not logged in. Redirecting to login page...');
        window.location.href = 'login_page.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                change
            }),
        });

        if (response.ok) {
            const updatedCart = await response.json();
            console.log('Cart updated:', updatedCart);

            // Fetch and display products again
            let allProducts = await fetchProducts();
            await displayProducts(allProducts, loggedInUser.id);
        } else {
            console.error('Error updating cart:', await response.text());
            alert('Failed to update cart quantity.');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('An error occurred while updating the cart.');
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

            // Fetch and display products again
            let allProducts = await fetchProducts();
            await displayProducts(allProducts, userId); // Refresh products to reflect cart changes
        } else {
            console.error('Error adding product to cart:', await response.text());
            alert('Failed to add product to cart.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('An error occurred while adding to the cart.');
    }
}

// Function to add a product to the user's favorites
async function addToFavorites(productId, userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/users/favorites/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            console.error('Failed to add to favorites.');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
}

// Function to remove a product from the user's favorites
async function removeFromFavorites(productId, userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/users/favorites/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            console.error('Failed to remove from favorites.');
        }
    } catch (error) {
        console.error('Error removing from favorites:', error);
    }
}