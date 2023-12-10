const port= process.env.PORT || 3000;
const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB...'))
app.use(express.static(path.join(__dirname, '../')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
});
app.get('/app.js', (req, res) => {
    res.sendFile(__dirname + '/app.js');
});
app.get('/orders.js', (req, res) => {
    res.sendFile(__dirname + '/orders.js');
});
app.get('/orders.html', (req, res) => {
    res.sendFile(__dirname + '/orders.html');
});
// Display products

// Products Schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stockQuantity: Number
  });
  
  
  const Product = mongoose.model('Product', productSchema, 'Products');


app.get('/products', async (req, res) => {
    try{
        const products = await mongoose.connection.db.collection('Products').find().toArray();
        res.send(products);
        res.status(200);
    }
    catch(err){
        console.log(err);
        res.status(500);
    }});
// Display searched products
app.get('/search', async (req, res) => {
    try{
        const products = await mongoose.connection.db.collection('Products').find({name: req.query.name}).toArray();
        res.send(products);
        res.status(200);
    }
    catch(err){
        console.log(err);
        res.status(500);
    }});

    const orderSchema = new mongoose.Schema({
        productname: String,
        customerName: String,
        products: [{
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: Number
        }],
        totalPrice: Number,
        shippingInformation: String
      });
      
      // Use the existing "Orders" collection
      const Order = mongoose.model('Order', orderSchema, 'orders');
      app.post('/add-to-cart', async (req, res) => {
        console.log(req.body);
        try {
          const order = await Order.create({
            productname: req.body.productname,
            customerName: req.body.customerName,
            products: req.body.products,
            totalPrice: req.body.products[0].quantity*req.body.totalPrice,
            shippingInformation: req.body.shippingInformation,
          });
      
          res.status(200).json({ message: 'Product added to the cart with customer information' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to add product to the cart' });
        }
      });
      
 // Display orders
  app.get('/orders', async (req, res) => {
      try{
          const orders = await mongoose.connection.db.collection('orders').find().toArray();
          res.send(orders);
          res.status(200);
      }
      catch(err){
          console.log(err);
          res.status(500);
      }});
      
      
app.listen(port, () => {
    console.log(`Server running at port `+port);
});

