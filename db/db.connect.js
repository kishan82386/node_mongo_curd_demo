require('dotenv').config();
const mongoose = require('mongoose');

let DB_URL = process.env.MONGO_CONNECTION_STRING;

mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection sucsessfull");
    })
    .catch((err) => {
        console.log(err)
    });

