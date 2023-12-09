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
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Category: ${product.category}</p>
          <p>Stock Quantity: ${product.stockQuantity}</p>
          <button class="add-to-cart" data-id=${product._id}>Add to Cart</button>
        `;
        productlist.appendChild(div);
      });
    }

    productlist.addEventListener('click', async (event) => {
      const addToCartButton = event.target.closest('.add-to-cart');
    
      if (addToCartButton) {
        const productId = addToCartButton.dataset.id;
    
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
                customerName: customerName,
                products: [{
                  productId: productId,
                  quantity: 1, // You can adjust the quantity as needed
                }],
                totalPrice: 0, // You may need to calculate the total price on the server side
                shippingInformation: shippingInfo,
              }),
            });
    
            if (response.ok) {
              console.log('Product added to the cart with customer information');
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
    
  
  });
  