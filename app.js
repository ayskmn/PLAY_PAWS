const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middleware/error');
const products = require('./routes/product');
const users = require('./routes/user');
const order = require('./routes/order');
const payment = require('./routes/payment');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());

// Middleware - Connect routes to app
app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', order);
app.use('/api/v1/chekout', payment);


app.use(errorMiddleware);


module.exports = app;