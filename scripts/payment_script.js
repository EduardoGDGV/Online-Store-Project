window.onload = async function () {
    const totalDisplay = document.getElementById('total-display');
    const form = document.getElementById('payment-details');
    form.style.display = 'none'; // Hide the payment form initially

    // Fetch the user's cart and calculate total price
    try {
        const itemTotal = await calculateTotal();
        const shippingCost = 5.00; // Default shipping cost
        const discount = 0.00; // Default discount
        const total = itemTotal + shippingCost - discount;

        document.getElementById('item-total').textContent = `$${itemTotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shippingCost.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        totalDisplay.textContent = `$${total.toFixed(2)}`;
    } catch (error) {
        console.error("Error calculating total:", error);
        document.body.innerHTML = '<p>Error loading payment page. Please try again later.</p>';
        return;
    }

    autofillAddressFields(); // Autofill address fields
    // Initialize payment option selection
    initPaymentSelection();
};

// Function to calculate and display the total price (use backend-provided totalCost)
async function calculateTotal() {
    const cart = await fetchCartData();

    // Use backend-provided totalCost
    return itemTotal = cart.totalCost;
}

// Function to fetch cart data from MongoDB
async function fetchCartData() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert("You need to be logged in to proceed with the payment.");
        window.location.href = 'login_page.html';
        throw new Error("User not logged in.");
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}`);
        const cartData = await response.json();

        if (response.ok) {
            return cartData; // Return the entire cart object, including totalCost
        } else {
            console.error("Error fetching cart data:", cartData.message);
            throw new Error(cartData.message || "Failed to fetch cart data.");
        }
    } catch (error) {
        console.error("Error fetching cart data:", error);
        throw new Error("Failed to fetch cart data.");
    }
}

// Function to display selected payment form
function selectPaymentMethod(method) {
    const form = document.getElementById('payment-form');
    form.innerHTML = '';

    const details = document.getElementById('payment-details');
    details.style.display = 'block'; // Show the payment form

    switch (method) {
        case 'credit':
            form.innerHTML = `
                <label for="cc-number">Card Number</label>
                <input type="text" id="cc-number" required pattern="\\d{16}" placeholder="1234 5678 9012 3456">
                <label for="cc-expiry">Expiry Date</label>
                <input type="text" id="cc-expiry" placeholder="MM/YY" required pattern="\\d{2}/\\d{2}">
                <label for="cc-cvc">CVC</label>
                <input type="text" id="cc-cvc" required pattern="\\d{3}" placeholder="123">
            `;
            break;
        case 'paypal':
            form.innerHTML = `
                <label for="paypal-email">PayPal Email</label>
                <input type="email" id="paypal-email" required placeholder="example@example.com">
            `;
            break;
        case 'pix':
            form.innerHTML = `<p>Use the QR code displayed on the next screen to complete the payment.</p>`;
            break;
        case 'boleto':
            form.innerHTML = `<p>A boleto will be generated for you to pay at your bank or online.</p>`;
            break;
        default:
            form.innerHTML = '<p>Invalid payment method selected.</p>';
    }
}

function validatePaymentForm(method) {
    const form = document.getElementById('payment-form');

    if (method === 'credit') {
        const cardNumber = document.getElementById('cc-number').value.trim();
        const expiry = document.getElementById('cc-expiry').value.trim();
        const cvc = document.getElementById('cc-cvc').value.trim();

        if (!cardNumber || !expiry || !cvc) {
            alert("Please fill out all credit card details.");
            return false;
        }
    } else if (method === 'paypal') {
        const email = document.getElementById('paypal-email').value.trim();
        if (!email) {
            alert("Please enter your PayPal email.");
            return false;
        }
    }

    return true;
}

function validateAddressFields() {
    const requiredFields = ['street', 'number', 'city', 'state', 'country', 'zip'];
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            alert(`Please fill out the ${field.previousElementSibling.textContent} field.`);
            field.focus();
            return false;
        }
    }
    return true;
}

async function confirmPurchase() {
    const paymentMethod = document.querySelector('.payment-option.selected')?.dataset.method;

    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    if (!validatePaymentForm(paymentMethod)) {
        return;
    }

    if (!validateAddressFields()) {
        return;
    }

    try {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert("You need to be logged in to complete the purchase.");
            window.location.href = 'login_page.html';
            return;
        }

        const cart = await fetchCartData(); // Fetch updated cart data
        const shippingCost = 5.00; // Default shipping cost
        const discount = 0.00; // Default discount
        const total = cart.totalCost + shippingCost - discount; // Correct total calculation

        const updatedItems = cart.items.map(item => ({
            product: item.product,
            price: item.product.price,
            quantity: item.quantity
        }));

        const orderDetails = {
            userId: loggedInUser.id,
            items: updatedItems,
            totalAmount: total, // Use corrected total
            paymentMethod: paymentMethod,
            address: {
                street: document.getElementById('street').value,
                number: document.getElementById('number').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                country: document.getElementById('country').value,
                zip: document.getElementById('zip').value,
                comments: document.getElementById('comments').value
            },
            status: 'pending',
            createdAt: new Date()
        };

        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        if (response.ok) {
            const order = await response.json();
            sessionStorage.setItem('orderId', order._id);
            // Call the /payment endpoint to process the payment and update stock
            const paymentResponse = await fetch(`http://localhost:5000/api/orders/${order._id}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod: paymentMethod })
            });

            if (paymentResponse.ok) {
                alert("Purchase confirmed! Thank you for shopping with us.");
                await clearCart(); // Clear the cart after payment
                window.location.href = 'order_confirmation.html';
            } else {
                const paymentErrorData = await paymentResponse.json();
                alert(`Payment Error: ${paymentErrorData.message}`);
            }
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error confirming purchase:", error);
        alert("There was an error processing your purchase. Please try again later.");
    }
}

// Function to clear the cart after purchase
async function clearCart() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert("You need to be logged in to complete the purchase.");
        window.location.href = 'login_page.html';
        return;
    }

    try {
        await fetch(`http://localhost:5000/api/cart/${loggedInUser.id}/all`, {
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
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectPaymentMethod(this.dataset.method);
        });
    });
}

function autofillAddressFields() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser?.address) {
        const { street, number, city, state, country, zip, comments } = loggedInUser.address;

        // Autofill the address form fields
        document.getElementById('street').value = street || '';
        document.getElementById('number').value = number || '';
        document.getElementById('city').value = city || '';
        document.getElementById('state').value = state || '';
        document.getElementById('country').value = country || '';
        document.getElementById('zip').value = zip || '';
        document.getElementById('comments').value = comments || '';
    }
}
