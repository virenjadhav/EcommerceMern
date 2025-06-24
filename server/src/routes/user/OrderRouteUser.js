const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/user/OrderController");

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/capture", capturePayment);
orderRouter.get("/:userId", getAllOrdersByUser);
orderRouter.get("/:id", getOrderDetails);

module.exports = orderRouter;
