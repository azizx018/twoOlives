import express, { request } from 'express';

//just for editing at the moment since there is no db
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

let cartItems = cartItemsRaw;
let products = productsRaw;


const port = 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/hello', (req, res) => {
    res.send("Hello Jello!")
});

app.get('/products', (req, res) => {
    res.json(products);

});
function populateCartIds(ids) {
    return ids.map(id => products.find(product => product.id === id))
    
}

app.get('/cart', (req, res) => {
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart);

});

app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = products.find(product => product.id === productId);
    res.json(product);

});

// app.post('/lulu', (req, res) => {
//     const data = request.body;
//     console.log(data.id);

// });

app.post('/cart', (req, res) => {
    const data = req.body;
    cartItems.push(data.id);
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart);
});

app.delete('/cart/:productId', (req, res) => {
    const productId = req.params.productId;
    cartItems = cartItems.filter(id => id !== productId);
    const populatedCart = populateCartIds(cartItems);
    res.json(populatedCart);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



