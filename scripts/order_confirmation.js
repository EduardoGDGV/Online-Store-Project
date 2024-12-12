window.onload = async function () {
    // Get the orderId from sessionStorage
    const orderId = sessionStorage.getItem('orderId');
    if (!orderId) {
        alert('Order ID not found. Please make sure the order was successfully placed.');
        window.location.href = 'main_page.html'; // Redirect to the home page if no orderId
        return;
    }

    // Fetch order details using the orderId
    try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const orderData = await response.json();

        if (response.ok) {
            // Populate the page with order details
            document.getElementById('order-id').textContent = orderData._id;
            document.getElementById('order-amount').textContent = `$${orderData.totalAmount.toFixed(2)}`;
            document.querySelector('.order-status span').textContent = orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1); // Capitalize status

            // Populate items list
            const itemsContainer = document.getElementById('order-items');
            for (let item of orderData.items) {
                const product = item.product; // The product is already included in the item
                const totalItemPrice = (product.price * item.quantity).toFixed(2); // Calculate total price for the item

                const itemElement = document.createElement('div');
                itemElement.classList.add('order-item');
                itemElement.innerHTML = `
                    <p><strong>Product:</strong> ${product.name}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Price:</strong> $${totalItemPrice}</p>
                    <hr>
                `;
                itemsContainer.appendChild(itemElement);
            }

            // Populate the final address
            const addressContainer = document.getElementById('shipping-address');
            const address = orderData.address;
            addressContainer.innerHTML = `
                <p><strong>Street:</strong> ${address.street}</p>
                <p><strong>Number:</strong> ${address.number}</p>
                <p><strong>City:</strong> ${address.city}</p>
                <p><strong>State:</strong> ${address.state}</p>
                <p><strong>Country:</strong> ${address.country}</p>
                <p><strong>Zip:</strong> ${address.zip}</p>
                <p><strong>Comments:</strong> ${address.comments || 'N/A'}</p>
            `;
        } else {
            throw new Error(orderData.message || 'Error fetching order details');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('There was an error fetching your order details. Please try again later.');
    }
};
