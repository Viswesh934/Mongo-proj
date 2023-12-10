document.addEventListener('DOMContentLoaded', function() {
    // display order history
    const orderHistory = document.getElementById('orderlist');

    fetch('http://localhost:3000/orders')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.forEach(order => {
                const div = document.createElement('div');
                div.className = 'order';
                div.innerHTML = `
                    <h3>Customer Name: ${order.customerName}</h3>
                    <p>Product: ${order.productname}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>Shipping Information: ${order.shippingInformation}</p>
                    <button class="cancel-order" data-id=${order._id}>Cancel Order</button>
                    <button class="edit-order" data-id=${order._id}>Edit Order</button>
                `;
                orderHistory.appendChild(div);
            });
     
            // Add click event listeners after orders are displayed 

            // Delete order from the database using orderHistory event listener
            orderHistory.addEventListener('click', async (event) => {
                if (event.target.className === 'cancel-order') {
                    const orderId = event.target.dataset.id;
                    const res = await fetch('http://localhost:3000/delete-order', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ orderId }),
                    });
                    const data = await res.json();
                    alert(data.message);
                    location.reload();
                }
            });
            
         // edit order's shipping information and customer name
            orderHistory.addEventListener('click', async (event) => {
                if (event.target.className === 'edit-order') {
                    const orderId = event.target.dataset.id;
                    const shippingInformation = prompt('Enter your shipping information:');
                    const customerName = prompt('Enter your name:');
                    const res = await fetch('http://localhost:3000/edit-order', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderId,
                            shippingInformation,
                            customerName,
                        }),
                    });
                    const data = await res.json();
                    alert(data.message);
                    location.reload();
                }
            });

     });

            

                
        
});
