document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchBar');
  const productlist = document.getElementById('productList');
  const cart = document.getElementById('cart');
  const addtocart = document.getElementsByClassName('add-to-cart');
  
  // Function to fetch and display all products
  const displayAllProducts = async () => {
    try {
      const products = await fetch('http://localhost:3000/products')
        .then((res) => res.json());
      displayProducts(products);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to fetch and display searched products
  const displaySearchedProducts = async () => {
    try {
      const products = await fetch(`http://localhost:3000/search?name=${search.value}`)
        .then((res) => res.json());
      displayProducts(products);
    } catch (err) {
      console.error(err);
    }
  };

  // Display all products initially
  displayAllProducts();

  // Event listener for keyup in the search bar
  search.addEventListener('keyup', () => {
    // Clear the existing products
    productlist.innerHTML = '';
    // If the search bar is not empty, display searched products
    if (search.value.trim() !== '') {
      displaySearchedProducts();
    } else {
      // Else display all products
      displayAllProducts();
    }
  });


  function displayProducts(products) {
    products.forEach((product) => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3 id="productname">${product.name}</h3>
        <p>${product.description}</p>
        <p id="price">Price: ${product.price}</p>
        <p>Category: ${product.category}</p>
        <p id="real-stock">Stock Quantity: ${product.stockQuantity}</p>
        <input type="number" id="stockQuantity" name="stockQuantity" min="1" max="${product.stockQuantity}" value="1">
        <button class="add-to-cart" data-id=${product._id}>Add to Cart</button>
      `;
      productlist.appendChild(div);
    });
  }

  productlist.addEventListener('click', async (event) => {
    const addToCartButton = event.target.closest('.add-to-cart');
  
    if (addToCartButton) {
      const productId = addToCartButton.dataset.id;
      const stockQuantity = addToCartButton.parentElement.querySelector('#stockQuantity').value;
      const productname = addToCartButton.parentElement.querySelector('#productname').innerHTML;
      const priceid = addToCartButton.parentElement.querySelector('#price').innerHTML
      const price=priceid.trim().replace('Price: ', '');
      console.log(price*2);
      // Prompt the user for shipping information and name
      const shippingInfo = prompt('Enter your shipping information:');
      const customerName = prompt('Enter your name:');
  
      if (productId && shippingInfo && customerName) {
        try {
          // Make a POST request to add the product to the cart
          const response = await fetch('http://localhost:3000/add-to-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productname: productname,
              customerName: customerName,
              products: [{
                productId: productId,
                quantity: stockQuantity, // You can adjust the quantity as needed
              }],
              totalPrice: price*stockQuantity, // You may need to calculate the total price on the server side
              shippingInformation: shippingInfo,
            }),
          });
  
          if (response.ok) {
            console.log('Product added to the cart with customer information');
            updateStockQuantity();
            // You can update the UI or perform other actions as needed
          } else {
            console.error('Failed to add product to the cart');
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log('Product ID, shipping information, and customer name are required.');
      }
    }
  });

  // update stock quantity
  const updateStockQuantity= async () => {
    const realStock = document.getElementById('real-stock').innerHTML;
    const stockQuantity = document.getElementById('stockQuantity').value;
    const productname = document.getElementById('productname').innerHTML;
    console.log(stockQuantity);
    console.log(productname);
    await fetch('http://localhost:3000/update-stock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productname,
        stockQuantity: stockQuantity,
      }),
    }).then((res) => {
      if (res.ok) {
        console.log('Stock quantity updated');
      } else {
        console.error('Failed to update stock quantity');
      }
    }).catch((err) => {
      console.error(err);
    });
  }
  

});
