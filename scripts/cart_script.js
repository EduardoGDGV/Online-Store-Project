window.onload = function () {
    displayCartItems();
};

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
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

    // Add remove item functionality
    document.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', function () {
            const itemIndex = this.getAttribute('data-index');
            removeItemFromCart(itemIndex);
        });
    });
}

function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage

    displayCartItems(); // Refresh the cart display
}
