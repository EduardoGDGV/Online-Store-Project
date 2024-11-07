window.onload = function () {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        let cartTotal = 0;

        cartItemsContainer.innerHTML = '';

        cartItems.forEach((item) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            `;
            cartItemsContainer.appendChild(cartItem);
            cartTotal += item.price * item.quantity;
        });

        cartTotalElement.innerText = cartTotal.toFixed(2);
    }

    document.getElementById('proceed-to-payment').addEventListener('click', () => {
        if (cartItems.length > 0) {
            window.location.href = 'payment_page.html';
        } else {
            alert('Your cart is empty.');
        }
    });

    renderCartItems();
};
