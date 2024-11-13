// When the window finishes loading, display the cart items
window.onload = function () {
    displayCartItems();
};

// Function to display items in the shopping cart
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items'); // Container for cart items
    const cartTotalContainer = document.getElementById('cart-total'); // Container for total price
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart data from localStorage or initialize an empty array
    
    cartItemsContainer.innerHTML = ''; // Clear any existing content in cart items container

    // If the cart is empty, display a message and clear the total price
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalContainer.innerHTML = '';
        return;
    }

    let totalPrice = 0; // Initialize total price accumulator

    // Loop through each item in the cart to generate its HTML structure
    cart.forEach((product, index) => {
        const itemDiv = document.createElement('div'); // Create a div for each cart item
        itemDiv.classList.add('cart-item'); // Add 'cart-item' class for styling

        // Populate the cart item with image, name, quantity controls, price, and remove button
        itemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
            </div>
            <div class="cart-item-details">
                <span class="cart-item-name">${product.name}</span>
                <div class="cart-item-quantity">
                    <!-- Button to decrease quantity, minimum of 1 -->
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${product.quantity}</span> <!-- Current quantity -->
                    <!-- Button to increase quantity -->
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <span class="cart-item-price">R$ ${(product.price * product.quantity).toFixed(2)}</span> <!-- Item price -->
                <!-- Button to remove item from cart -->
                <button class="remove-item" onclick="removeItemFromCart(${index})">x</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemDiv); // Add the item div to the cart items container

        totalPrice += product.price * product.quantity; // Add to total price
    });

    // Display the total price in the cart total container
    cartTotalContainer.innerHTML = `<div class="total-text">
                                        <p>Subtotal</p>
                                        <p>R$ ${totalPrice.toFixed(2)}</p>
                                    </div>`;
}

// Function to update the quantity of a specific item in the cart
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage
    cart[index].quantity = Math.max(1, cart[index].quantity + change); // Update quantity and ensure it doesn’t go below 1
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart back to localStorage
    displayCartItems(); // Refresh cart display to show updated quantities and price
}

// Function to remove an item from the cart
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart back to localStorage
    displayCartItems(); // Refresh cart display to show the updated list
}
