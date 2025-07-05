const express = require("express");
const {
  createPaymentIntent,
  confirmPayment,
} = require("../../controllers/user/OrderController");

const orderRouter = express.Router();

// orderRouter.post("/", createOrder);
// orderRouter.post("/capture", capturePayment);
// orderRouter.get("/:userId", getAllOrdersByUser);
// orderRouter.get("/:id", getOrderDetails);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );

// // Payment routes
// router.post("/create-payment-intent", createPaymentIntent);
// router.post("/confirm-payment", confirmPayment);
// router.get("/user/:userId", getUserOrders);
orderRouter.post("/create-payment-intent", createPaymentIntent);
orderRouter.post("/confirm-payment", confirmPayment);

module.exports = orderRouter;
