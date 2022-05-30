require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products');
//middleware

const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');




app.use(express.json());

//routes

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products"> Products Route</a>')
})


//products route
app.use('/api/v1/products', productsRouter);;



app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000

const start = async() => {
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening ${port}...`))
    } catch (error) {

    }
}
start();