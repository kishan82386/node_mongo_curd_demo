require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db/db.connect');
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json({ limit: '30mb', extended: true }));

const PORT = 3000 || process.env.PORT

const route = require('./routes');
app.use(route);

app.listen(PORT, (err) => {
    if (!err) console.log("Server is running.");
});