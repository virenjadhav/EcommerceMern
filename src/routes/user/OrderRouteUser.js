const express = require("express");
const { createOrder } = require("../../controllers/user/OrderController");

const orderRouter = express.Router();

// create order
orderRouter.post("/", createOrder);

// capture order
// orderRouter.post("/captureOrder/:orderId", capturePaymentFromOrder);

module.exports = orderRouter;
