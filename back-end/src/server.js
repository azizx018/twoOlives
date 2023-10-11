import { cartItems, products } from './temp-data';
import express from 'express';

const port = 8000;

const app = express();

app.get('/hello', (req, res) => {
    res.send("Hello Jello!")
});

app.get('/products', (req, res) => {
    res.json(products);

});

app.get('/cart', (req, res) => {
    res.json(cartItems);

});

app.get('/products/:productId', (req, res) => {
    const productId = re.params.productId;
    const product = products.find(product => product.id === productId);
    res.json(product);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);


});



