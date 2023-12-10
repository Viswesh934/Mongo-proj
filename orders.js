document.addEventListener('DOMContentLoaded', function() {
    // display order history
    const orderHistory = document.getElementById('orderHistory');
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
            `;
            orderHistory.appendChild(div);
        });
    })
    


});