import express, { request } from 'express';
import { MongoClient } from 'mongodb';
require('dotenv').config()
import 'dotenv/config';
import path from 'path';



async function start() {
    const port =  process.env.PORT || 8000;
    const url = `mongodb+srv://fullstack-server:${process.env.DB_PASSWORD}@cluster0.toqxqs8.mongodb.net/?retryWrites=true&w=majority`

    const client = new MongoClient(url);

    await client.connect();
    const db = client.db('fsv-db');

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, '../assets')));

    app.use(express.static(
        path.resolve(__dirname, '../dist'),
        {maxAge: '1y', etag: false},
    ));


    app.get('/api/products', async (req, res) => {

        const products = await db.collection('products').find({}).toArray();
        res.send(products);
    });


    async function populateCartIds(ids) {
        if (ids) {
            return Promise.all(ids.map(id => db.collection('products').findOne({ id })));
        }
    }

    app.get('/api/users/:userId/cart', async (req, res) => {
        const user = await db.collection('users').findOne({ id: req.params.userId });
        const populatedCart = await populateCartIds(user?.cartItems);
        res.json(populatedCart);

    });

    app.get('/api/products/:productId', async (req, res) => {
        const productId = req.params.productId;
        const product = await db.collection('products').findOne({ id: productId });
        res.json(product);

    });


    app.post('/api/users/:userId/cart', async (req, res) => {
        const userId = req.params.userId;
        const productId = req.body.id;

        const existingUser = await db.collection('users').findOne({ id: userId});
        if (!existingUser) {
            await db.collection('users').insertOne({ id: userId}, {cartItems: []});
        }

        await db.collection('users').updateOne({ id: userId }, {
            //tells mongo what type of update- adding productid onto arry of cart items
            // push: { cartItems: productId }
            //this makes it so the user can't add duplicates
            $addToSet: { cartItems: productId }
        });
        const user = await db.collection('users').findOne({ id: req.params.userId });
        const populatedCart = await populateCartIds(user?.cartIems);
        res.json(populatedCart);
    });

    app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;
        await db.collection('users').updateOne({ id: userId }, {
            $pull: { cartItems: productId },
        });

        const user = await db.collection('users').findOne({ id: req.params.userId });
        const populatedCart = await populateCartIds(user?.cartItems);
        res.json(populatedCart);
    });

    //takes care of other requests not handeled above
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });



    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });


}

start();



