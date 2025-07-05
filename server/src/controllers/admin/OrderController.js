const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");
const User = require("../../models/User");

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (carrier) {
      order.carrier = carrier;
    }

    // Update delivery status
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

// @desc    Process refund
// @route   POST /api/orders/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.stripePaymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "No payment intent found for this order",
      });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if no amount specified
      reason: reason || "requested_by_customer",
    });

    // Update order
    order.isRefunded = true;
    order.refundedAt = new Date();
    order.refundAmount = refund.amount / 100;
    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refund,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process refund",
    });
  }
};
