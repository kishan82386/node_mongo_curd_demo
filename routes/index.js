const express = require("express");

const userRoute = require('./user.route');

const router = express.Router();

router.use('/user', require('./user.route'))

module.exports = router;