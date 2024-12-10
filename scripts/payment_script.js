window.onload = function () {
    const totalDisplay = document.getElementById('total-display');
    const form = document.getElementById('payment-details');
    form.style.display = 'none'; // Hide the payment form initially

    // Fetch the user's cart and calculate total price
    const itemTotal = calculateTotal();
    const shippingCost = 5.00;
    const discount = 0.00;
    const total = itemTotal + shippingCost - discount;

    document.getElementById('item-total').textContent = `$${itemTotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shippingCost.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;

    // Initialize payment option selection
    initPaymentSelection();
};

// Function to fetch cart data from MongoDB and calculate the total
async function calculateTotal() {
    const cart = await fetchCartData();
    return cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
}

// Function to fetch cart data from MongoDB
async function fetchCartData() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
        alert("You need to be logged in to proceed with the payment.");
        window.location.href = 'login.html';
        return [];
    }

    try {
        const response = await fetch(`/api/carts/${loggedInUserId}`);
        const cartData = await response.json();
        return cartData.items || [];
    } catch (error) {
        console.error("Error fetching cart data:", error);
        return [];
    }
}

// Function to display selected payment form
function selectPaymentMethod(method) {
    const form = document.getElementById('payment-form');
    form.innerHTML = '';

    const details = document.getElementById('payment-details');
    // Show the payment form once a method is selected
    details.style.display = 'block';

    if (method === 'credit') {
        form.innerHTML = `
            <label for="cc-number">Card Number</label>
            <input type="text" id="cc-number" required>
            <label for="cc-expiry">Expiry Date</label>
            <input type="text" id="cc-expiry" placeholder="MM/YY" required>
            <label for="cc-cvc">CVC</label>
            <input type="text" id="cc-cvc" required>
        `;
    } else if (method === 'paypal') {
        form.innerHTML = `
            <label for="paypal-email">PayPal Email</label>
            <input type="email" id="paypal-email" required>
        `;
    } else if (method === 'pix') {
        form.innerHTML = `<p>Use the QR code displayed on the next screen to complete the payment.</p>`;
    } else if (method === 'boleto') {
        form.innerHTML = `<p>A boleto will be generated for you to pay at your bank or online.</p>`;
    }
}

// Function to handle confirmation
async function confirmPurchase() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const totalAmount = parseFloat(document.getElementById('total-display').textContent.slice(1)); // Remove '$' and parse

    if (!loggedInUserId) {
        alert("You need to be logged in to complete the purchase.");
        return;
    }

    const paymentMethod = document.querySelector('.payment-option.selected')?.dataset.method;

    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    const orderDetails = {
        userId: loggedInUserId,
        items: await fetchCartData(),
        totalAmount,
        paymentMethod,
        status: 'pending', // or 'paid' based on successful payment
        createdAt: new Date()
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        if (response.ok) {
            alert("Purchase confirmed! Thank you for shopping with us.");
            // Optionally, clear the cart after the purchase
            await clearCart();
            window.location.href = 'order_confirmation.html'; // Redirect to order confirmation page
        } else {
            alert("Failed to confirm the purchase. Please try again.");
        }
    } catch (error) {
        console.error("Error confirming purchase:", error);
        alert("There was an error processing your purchase. Please try again later.");
    }
}

// Function to clear the cart after purchase
async function clearCart() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) return;

    try {
        await fetch(`/api/carts/${loggedInUserId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error("Error clearing the cart:", error);
    }
}

// Function to handle payment option selection
function initPaymentSelection() {
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove 'selected' class from any previously selected option
            paymentOptions.forEach(opt => opt.classList.remove('selected'));

            // Add 'selected' class to the clicked option and update the form
            this.classList.add('selected');
            selectPaymentMethod(this.dataset.method); // Assumes each option has a `data-method` attribute
        });
    });
}
