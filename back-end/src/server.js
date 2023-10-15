import express, { request } from 'express';
import { MongoClient } from  'mongodb';
require('dotenv').config()
import 'dotenv/config';






async function start () {
    const port = 8000;
    const url = `mongodb+srv://fullstack-server:${process.env.DB_PASSWORD}@cluster0.toqxqs8.mongodb.net/?retryWrites=true&w=majority`

    const client = new MongoClient(url);  
    
    await client.connect();
    const db = client.db('fsv-db');

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));


    app.get('/products', async (req, res) => {
        
        const products = await db.collection('products').find({}).toArray();
        res.send(products);
    });


    async function populateCartIds(ids) {
        return Promise.all(ids.map(id => db.collection('products').findOne({id})));
        
    }

    app.get('/users/:userId/cart', async (req, res) => {
        const user = await db.collection('users').findOne({ id: req.params.userId});
        const populatedCart = await populateCartIds(user.cartItems);
        res.json(populatedCart);

    });

    app.get('/products/:productId', async (req, res) => {
        const productId = req.params.productId;
        const product = await db.collection('products').findOne({ id : productId});
        res.json(product);

    });


    app.post('/users/:userId/cart', async (req, res) => {
        const userId = req.params.userId;
        const productId = req.body.id;

        await db.collection('users').updateOne({ id: userId}, {
            //tells mongo what type of update- adding productid onto arry of cart items
            // push: { cartItems: productId }
            //this makes it so the user can't add duplicates
            $addToSet: { cartItems: productId} 
        });
        const user = await db.collection('users').findOne({ id: req.params.userId});
        const populatedCart = await populateCartIds(user.cartItems);
        res.json(populatedCart);
    });

    app.delete('/users/:userId/cart/:productId', async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;
        await db.collection('users').updateOne({ id: userId}, {
            $pull: { cartItems: productId},
        });

        const user = await db.collection('users').findOne({ id: req.params.userId});
        const populatedCart = await populateCartIds(user.cartItems);
        res.json(populatedCart);
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });


}

start();



