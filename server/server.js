const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./db/database');
const userModel = require('./models/userModel');
const cors = require('cors')
const bodyParser = require("body-parser");
// Routers
const userRoute = require('./routes/userRoute');
const catagoryRoute = require('./routes/catagoryRoute');
const productRoute = require('./routes/productRouter');
const paymentRoute = require('./routes/paymentRoute');
require("./cron/generateAssociationRule.js");

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://akshay-shop.onrender.com"],
    credentials: true
}));
app.use(bodyParser.json());
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("server start");
})

app.use('/user',userRoute);
app.use('/api',catagoryRoute);
app.use('/api',productRoute);
app.use('/api/payment',paymentRoute);
app.use('/order',require('./routes/orderRoute'));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
