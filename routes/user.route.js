const express = require("express");
const userController = require('../controller/user.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.post("/signup", userController.userSignUP);
router.post("/login", userController.logIn);

router.get('/allUserList', Auth.decodeToken, userController.getAllUser);
router.post("/ownUserCreate", Auth.decodeToken, userController.ownUserSignUP);
router.get("/getuserbyid/:id", Auth.decodeToken, userController.getById);
router.patch("/getuserbyid/:id", Auth.decodeToken, userController.updateUserOwnuser);
router.delete("/getuserbyid/:id", Auth.decodeToken, userController.deleteUser);


module.exports = router