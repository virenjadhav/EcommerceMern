const express = require("express");
const {
  createPaymentIntent,
} = require("../../controllers/user/OrderController");

const orderRouter = express.Router();

// const { protect, admin } = require('../middleware/authMiddleware');

// // Webhook route (must be before express.json() middleware)
// router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

// // Payment routes
// router.post('/create-payment-intent', protect, createPaymentIntent);
// router.post('/confirm-payment', protect, confirmPayment);

// // Order management routes
// router.get('/', protect, admin, getAllOrders);
// router.get('/:id', protect, getOrderById);
// router.get('/user/:userId', protect, getUserOrders);
// router.put('/:id/status', protect, admin, updateOrderStatus);
// router.post('/:id/refund', protect, admin, processRefund);

module.exports = orderRouter;
