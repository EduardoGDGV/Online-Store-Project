window.onload = function () {
    displayCartItems();
};

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-btn');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = ''; // Clear any existing cart items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
        cartTotalContainer.innerHTML = '';
        return;
    }

    let totalPrice = 0;

    cart.forEach((product, index) => {
        const productRow = document.createElement('tr');
        productRow.classList.add('cart-item');

        productRow.innerHTML = `
            <td class="cart-item-details">
                <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
                <span class="cart-item-name">${product.name}</span>
            </td>
            <td class="cart-item-price">R$ ${Number(product.price).toFixed(2)}</td>
            <td class="cart-item-quantity">
                <span>${product.quantity}</span>
            </td>
            <td><span class="remove-item" data-index="${index}">Remove</span></td>
        `;

        cartItemsContainer.appendChild(productRow);

        totalPrice += product.price * product.quantity;
    });

    cartTotalContainer.innerHTML = `<p>Total: R$ ${totalPrice.toFixed(2)}</p>`;
    checkoutButton.classList.remove('disabled'); // Ensure checkout button is enabled
    checkoutButton.href = 'payment_page.html'; // Set link to payment page

    // Add remove item functionality
    document.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', function () {
            const itemIndex = this.getAttribute('data-index');
            removeItemFromCart(itemIndex);
        });
    });
}

// Function to show error if cart is empty
function checkCartBeforeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return false;
    }
    return true;
}

// Attach the function to the checkout button's click event
document.getElementById('checkout-btn').addEventListener('click', function(event) {
    if (!checkCartBeforeCheckout()) {
        event.preventDefault(); // Prevent navigation to the payment page if cart is empty
    }
});

function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage

    displayCartItems(); // Refresh the cart display
}
