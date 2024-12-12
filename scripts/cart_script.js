// When the window finishes loading, display the cart items
window.onload = async function () {
    await displayCartItems();
    const loadIcon = document.getElementById('loader');
    // Hide the loader after the products are loaded
    loadIcon.style.display = 'none';
};

// Function to display items in the shopping cart
async function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items'); // Container for cart items
    const cartTotalContainer = document.getElementById('cart-total'); // Container for total price
    const checkoutBtn = document.getElementById('checkout-btn'); // Checkout button
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Assuming the user is logged in

    if (!loggedInUser || !loggedInUser.id) {
        // Redirect if the user is not logged in
        window.location.href = 'login_page.html';
        return;
    }

    try {
        // Fetch the user's cart from the server
        const cartResponse = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`);
        if (!cartResponse.ok) throw new Error('Failed to fetch cart');

        const cart = await cartResponse.json();
        cartItemsContainer.innerHTML = ''; // Clear any existing content in cart items container

        // If the cart is empty, display a message and clear the total price
        if (!cart || cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalContainer.innerHTML = '';
            checkoutBtn.style="display: none;"
            return;
        }else{
            checkoutBtn.style="display: block;"
        }

        let totalPrice = 0; // Initialize total price accumulator

        // Loop through each item in the cart to generate its HTML structure
        cart.items.forEach((item, index) => {
            const itemDiv = document.createElement('div'); // Create a div for each cart item
            itemDiv.classList.add('cart-item'); // Add 'cart-item' class for styling

            // Populate the cart item with image, name, quantity controls, price, and remove button
            itemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.product.image || 'images/default-placeholder.png'}" alt="${item.product.name}">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.product.name}</span>
                    <div class="cart-item-quantity">
                        <!-- Button to decrease quantity, minimum of 1 -->
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span> <!-- Current quantity -->
                        <!-- Button to increase quantity -->
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">R$ ${(item.product.price * item.quantity).toFixed(2)}</span> <!-- Item price -->
                    <!-- Button to remove item from cart -->
                    <button class="remove-item" onclick="removeItemFromCart(${index})">x</button>
                </div>
            `;

            cartItemsContainer.appendChild(itemDiv); // Add the item div to the cart items container

            totalPrice += item.product.price * item.quantity; // Add to total price
        });

        // Display the total price in the cart total container
        cartTotalContainer.innerHTML = `<div class="total-text">
                                            <p>Subtotal</p>
                                            <p>R$ ${totalPrice.toFixed(2)}</p>
                                        </div>`;

    } catch (error) {
        console.error('Error fetching cart:', error);
        cartItemsContainer.innerHTML = '<p>Error loading your cart. Please try again later.</p>';
        cartTotalContainer.innerHTML = '';
    }
}

// Function to update the quantity of a specific item in the cart
async function updateQuantity(index, change) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Assuming the user is logged in
    if (!loggedInUser || !loggedInUser.id) {
        // Redirect if the user is not logged in
        window.location.href = 'login_page.html';
        return;
    }

    try {
        // Fetch the cart data from the server
        const cartResponse = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`);
        const cart = await cartResponse.json();

        // Update the quantity of the specific item
        const item = cart.items[index];
        item.quantity = Math.max(1, item.quantity + change); // Ensure quantity doesn’t go below 1

        // Send the updated cart back to the server
        const updateResponse = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: item.product._id,
                change: change,
            }),
        });

        if (updateResponse.ok) {
            await displayCartItems(); // Refresh the cart display to show updated quantities and price
        } else {
            console.error('Error updating cart:', await updateResponse.text());
            alert('Failed to update cart quantity.');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('An error occurred while updating the cart.');
    }
}

// Function to remove an item from the cart
async function removeItemFromCart(index) {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Assuming the user is logged in
    if (!loggedInUser || !loggedInUser.id) {
        // Redirect if the user is not logged in
        window.location.href = 'login_page.html';
        return;
    }

    try {
        // Fetch the cart data from the server
        const cartResponse = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`);
        const cart = await cartResponse.json();

        // Remove the item from the cart
        const itemToRemove = cart.items[index];
        const removeResponse = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: itemToRemove.product._id,
            }),
        });

        if (removeResponse.ok) {
            await displayCartItems(); // Refresh the cart display to show the updated list
        } else {
            console.error('Error removing item from cart:', await removeResponse.text());
            alert('Failed to remove item from cart.');
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert('An error occurred while removing the item from the cart.');
    }
}
