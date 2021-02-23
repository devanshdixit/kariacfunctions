var express = require("express");
const { register, signin , shipping } = require('../controllers/users');
var userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/signin",signin);
userRouter.post("/shipping",shipping);

module.exports = userRouter;
