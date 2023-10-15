import express, { request } from 'express';
import { MongoClient } from  'mongodb';
require('dotenv').config()
import 'dotenv/config';



//just for editing at the moment since there is no db
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

let cartItems = cartItemsRaw;
let products = productsRaw;

const url = `mongodb+srv://fullstack-server:${process.env.DB_PASSWORD}@cluster0.toqxqs8.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(url);

const port = 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/products', async (req, res) => {
    await client.connect();
    const db = client.db('fsv-db');
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
});


async function populateCartIds(ids) {
    await client.connect();
    const db = client.db('fsv-db');
    return Promise.all(ids.map(id => db.collection('products').findOne({id})));
    
}

app.get('/users/:userId/cart', async (req, res) => {
    await client.connect();
    const db = client.db('fsv-db');
    const user = await db.collection('users').findOne({ id: req.params.userId});
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);

});

app.get('/products/:productId', async (req, res) => {
    await client.connect();
    const db = client.db('fsv-db');
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({ id : productId});
    res.json(product);

});


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



