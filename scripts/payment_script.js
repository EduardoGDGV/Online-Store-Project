// Set the total price on page load
window.onload = function () {
    const totalDisplay = document.getElementById('total-display');
    const total = calculateTotal();
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// Calculate the total from cart items stored in localStorage
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach((product) => {
        total += product.price * product.quantity;
    });

    return total;
}

// Display and calculate installment options based on the cart total
function showInstallments() {
    const installmentsDiv = document.querySelector('.installments');
    installmentsDiv.style.display = 'block';

    const installmentOptions = document.getElementById('installment-options');
    installmentOptions.innerHTML = ''; // Clear previous options if any

    const total = calculateTotal();
    const maxInstallments = 6;

    for (let i = 1; i <= maxInstallments; i++) {
        const installmentAmount = (total / i).toFixed(2);
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}x - $${installmentAmount}`;
        installmentOptions.appendChild(option);
    }
}

// Function to handle payment method selection
function choosePayment(method) {
    alert(`You chose ${method}. Proceeding to payment...`);
    // Add any additional handling here
}