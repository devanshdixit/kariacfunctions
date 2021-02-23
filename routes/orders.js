var express = require("express");
const { orders , orderDetails ,orderPayment ,myorders , trackorders} = require("../controllers/orders");
const { isAuth } = require("../controllers/utils");
var orderRouter = express.Router();

orderRouter.post("/createorder", isAuth, orders );
orderRouter.get("/:id",  isAuth, orderDetails);
orderRouter.put('/:id/pay',isAuth, orderPayment);
orderRouter.post('/order/my',isAuth, myorders);
orderRouter.get('/track/:id',isAuth, trackorders);
module.exports = orderRouter;  