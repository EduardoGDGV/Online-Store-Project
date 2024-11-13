// Set the total price and update summary
window.onload = function () {
    const totalDisplay = document.getElementById('total-display');
    const form = document.getElementById('payment-details');
    form.style.display = 'none'; // Hide the payment form initially
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

// Function to calculate cart total from localStorage
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
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
function confirmPurchase() {
    alert("Purchase confirmed! Thank you for shopping with us.");
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
