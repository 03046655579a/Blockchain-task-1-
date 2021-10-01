const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const orderRoute = require('./route');


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cookieParser());
app.use(cors());

app.use('/api', orderRoute);

const port = 4200;

app.listen(port, () =>{
    console.log(`app is running at ${port}`);});
