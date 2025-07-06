const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        image: { type: String },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      default: "stripe",
      enum: ["stripe"],
    },

    paymentResult: {
      id: String,           // Stripe PaymentIntent ID
      status: String,       // succeeded, failed, etc.
      email_address: String,
      update_time: Date,
    },

    stripePaymentIntentId: String,
    stripeCustomerId: String,

    // Amounts
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // Payment and Delivery Status
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,

    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,

    // Order Status
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "pending",     // order placed but payment not yet initiated
        "processing",  // Stripe PaymentIntent created
        "paid",        // Stripe payment succeeded
        "failed",      // Stripe payment failed
        "cancelled",   // cancelled by admin/user
        "shipped",     // admin marked shipped
        "delivered",   // delivered
        "refunded",    // refunded
      ],
      default: "pending",
    },

    // Admin + Customer Notes
    orderNotes: { type: String, maxlength: 500 },

    // Shipping Tracking Info
    trackingNumber: { type: String },
    carrier: { type: String },

    // Refund Details
    isRefunded: { type: Boolean, default: false },
    refundedAt: { type: Date },
    refundAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate item totals
orderSchema.pre("save", function (next) {
  this.itemsPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  next();
});

// Methods
orderSchema.methods.calculateTotal = function () {
  this.itemsPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  return this.totalPrice;
};

orderSchema.methods.updateStatus = function (newStatus) {
  this.orderStatus = newStatus;
  if (newStatus === "delivered") {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }
  return this.save();
};

// Virtual Order Number
orderSchema.virtual("orderNumber").get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

orderSchema.set("toJSON", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;



// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },

//     // Order Items
//     items: [
//       {
//         productId: {
//           type: String,
//           required: true,
//         },
//         name: {
//           type: String,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         price: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         image: {
//           type: String,
//         },
//       },
//     ],

//     // Shipping Information
//     shippingAddress: {
//       address: {
//         type: String,
//         required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       postalCode: {
//         type: String,
//         required: true,
//       },
//       country: {
//         type: String,
//         required: true,
//       },
//     },

//     // Payment Information
//     paymentMethod: {
//       type: String,
//       required: true,
//       default: "stripe",
//     },

//     paymentResult: {
//       id: String, // Stripe payment intent ID
//       status: String, // Payment status from Stripe
//       update_time: Date,
//       email_address: String,
//     },

//     // Pricing
//     itemsPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },

//     taxPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },

//     shippingPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },

//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },

//     // Order Status
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },

//     paidAt: {
//       type: Date,
//     },

//     isDelivered: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },

//     deliveredAt: {
//       type: Date,
//     },

//     // Order Status Tracking
//     orderStatus: {
//       type: String,
//       required: true,
//       enum: [
//         "pending",
//         "processing",
//         "confirmed",
//         "shipped",
//         "delivered",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     // Order Notes/Comments
//     orderNotes: {
//       type: String,
//       maxlength: 500,
//     },

//     // Tracking Information
//     trackingNumber: {
//       type: String,
//     },

//     carrier: {
//       type: String,
//     },

//     // Refund Information
//     isRefunded: {
//       type: Boolean,
//       default: false,
//     },

//     refundedAt: {
//       type: Date,
//     },

//     refundAmount: {
//       type: Number,
//       default: 0,
//     },

//     // Stripe specific fields
//     stripePaymentIntentId: {
//       type: String,
//     },

//     stripeCustomerId: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt automatically
//   }
// );

// // Calculate items price before saving
// orderSchema.pre("save", function (next) {
//   if (this.items && this.items.length > 0) {
//     this.itemsPrice = this.items.reduce((acc, item) => {
//       return acc + item.price * item.quantity;
//     }, 0);

//     // Calculate total if not already set
//     if (!this.totalPrice) {
//       this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
//     }
//   }
//   next();
// });

// // Instance method to calculate total
// orderSchema.methods.calculateTotal = function () {
//   this.itemsPrice = this.items.reduce((acc, item) => {
//     return acc + item.price * item.quantity;
//   }, 0);

//   this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
//   return this.totalPrice;
// };

// // Static method to find orders by status
// orderSchema.statics.findByStatus = function (status) {
//   return this.find({ orderStatus: status });
// };

// // Static method to find orders by date range
// orderSchema.statics.findByDateRange = function (startDate, endDate) {
//   return this.find({
//     createdAt: {
//       $gte: startDate,
//       $lte: endDate,
//     },
//   });
// };

// // Instance method to update order status
// orderSchema.methods.updateStatus = function (newStatus) {
//   this.orderStatus = newStatus;

//   // Update delivery status based on order status
//   if (newStatus === "delivered") {
//     this.isDelivered = true;
//     this.deliveredAt = new Date();
//   }

//   return this.save();
// };

// // Virtual for order number (using _id)
// orderSchema.virtual("orderNumber").get(function () {
//   return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
// });

// // Ensure virtual fields are serialized
// orderSchema.set("toJSON", {
//   virtuals: true,
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;

// // const mongoose = require("mongoose");

// // const OrderSchema = new mongoose.Schema({
// //   userId: String,
// //   cartId: String,
// //   cartItems: [
// //     {
// //       productId: String,
// //       title: String,
// //       image: String,
// //       price: String,
// //       quantity: Number,
// //     },
// //   ],
// //   addressInfo: {
// //     addressId: String,
// //     address: String,
// //     city: String,
// //     pincode: String,
// //     phone: String,
// //     notes: String,
// //   },
// //   orderStatus: String,
// //   paymentMethod: String,
// //   paymentStatus: String,
// //   totalAmount: Number,
// //   orderDate: Date,
// //   orderUpdateDate: Date,
// //   paymentId: String,
// //   payerId: String,
// // });

// // module.exports = mongoose.model("Order", OrderSchema);

// // models/Order.js
// // const mongoose = require("mongoose");

// // const orderSchema = new mongoose.Schema(
// //   {
// //     user: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       required: true,
// //       ref: "User",
// //     },

// //     // Order Items
// //     items: [
// //       {
// //         product: {
// //           type: mongoose.Schema.Types.ObjectId,
// //           required: true,
// //           ref: "Product",
// //         },
// //         name: {
// //           type: String,
// //           required: true,
// //         },
// //         quantity: {
// //           type: Number,
// //           required: true,
// //           min: 1,
// //         },
// //         price: {
// //           type: Number,
// //           required: true,
// //           min: 0,
// //         },
// //         image: {
// //           type: String,
// //           required: true,
// //         },
// //       },
// //     ],

// //     // Shipping Information
// //     shippingAddress: {
// //       address: {
// //         type: String,
// //         required: true,
// //       },
// //       city: {
// //         type: String,
// //         required: true,
// //       },
// //       postalCode: {
// //         type: String,
// //         required: true,
// //       },
// //       country: {
// //         type: String,
// //         required: true,
// //       },
// //     },

// //     // Payment Information
// //     paymentMethod: {
// //       type: String,
// //       required: true,
// //       default: "stripe",
// //     },

// //     paymentResult: {
// //       id: String, // Stripe payment intent ID
// //       status: String, // Payment status from Stripe
// //       update_time: Date,
// //       email_address: String,
// //     },

// //     // Pricing
// //     itemsPrice: {
// //       type: Number,
// //       required: true,
// //       default: 0.0,
// //     },

// //     taxPrice: {
// //       type: Number,
// //       required: true,
// //       default: 0.0,
// //     },

// //     shippingPrice: {
// //       type: Number,
// //       required: true,
// //       default: 0.0,
// //     },

// //     totalPrice: {
// //       type: Number,
// //       required: true,
// //       default: 0.0,
// //     },

// //     // Order Status
// //     isPaid: {
// //       type: Boolean,
// //       required: true,
// //       default: false,
// //     },

// //     paidAt: {
// //       type: Date,
// //     },

// //     isDelivered: {
// //       type: Boolean,
// //       required: true,
// //       default: false,
// //     },

// //     deliveredAt: {
// //       type: Date,
// //     },

// //     // Order Status Tracking
// //     orderStatus: {
// //       type: String,
// //       required: true,
// //       enum: [
// //         "pending",
// //         "processing",
// //         "confirmed",
// //         "shipped",
// //         "delivered",
// //         "cancelled",
// //       ],
// //       default: "pending",
// //     },

// //     // Order Notes/Comments
// //     orderNotes: {
// //       type: String,
// //       maxlength: 500,
// //     },

// //     // Tracking Information
// //     trackingNumber: {
// //       type: String,
// //     },

// //     carrier: {
// //       type: String,
// //     },

// //     // Refund Information
// //     isRefunded: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     refundedAt: {
// //       type: Date,
// //     },

// //     refundAmount: {
// //       type: Number,
// //       default: 0,
// //     },

// //     // Stripe specific fields
// //     stripePaymentIntentId: {
// //       type: String,
// //     },

// //     stripeCustomerId: {
// //       type: String,
// //     },
// //   },
// //   {
// //     timestamps: true, // Adds createdAt and updatedAt automatically
// //   }
// // );

// // // Calculate items price before saving
// // orderSchema.pre("save", function (next) {
// //   if (this.items && this.items.length > 0) {
// //     this.itemsPrice = this.items.reduce((acc, item) => {
// //       return acc + item.price * item.quantity;
// //     }, 0);

// //     // Calculate total if not already set
// //     if (!this.totalPrice) {
// //       this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
// //     }
// //   }
// //   next();
// // });

// // // Instance method to calculate total
// // orderSchema.methods.calculateTotal = function () {
// //   this.itemsPrice = this.items.reduce((acc, item) => {
// //     return acc + item.price * item.quantity;
// //   }, 0);

// //   this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
// //   return this.totalPrice;
// // };

// // // Static method to find orders by status
// // orderSchema.statics.findByStatus = function (status) {
// //   return this.find({ orderStatus: status });
// // };

// // // Static method to find orders by date range
// // orderSchema.statics.findByDateRange = function (startDate, endDate) {
// //   return this.find({
// //     createdAt: {
// //       $gte: startDate,
// //       $lte: endDate,
// //     },
// //   });
// // };

// // // Instance method to update order status
// // orderSchema.methods.updateStatus = function (newStatus) {
// //   this.orderStatus = newStatus;

// //   // Update delivery status based on order status
// //   if (newStatus === "delivered") {
// //     this.isDelivered = true;
// //     this.deliveredAt = new Date();
// //   }

// //   return this.save();
// // };

// // // Virtual for order number (using _id)
// // orderSchema.virtual("orderNumber").get(function () {
// //   return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
// // });

// // // Ensure virtual fields are serialized
// // orderSchema.set("toJSON", {
// //   virtuals: true,
// // });

// // const Order = mongoose.model("Order", orderSchema);

// // module.exports = Order;

// // ===============================
// // EXAMPLE USAGE IN CONTROLLER
// // ===============================

// /*
// // Example of creating an order with the model
// const createOrder = async (orderData) => {
//   try {
//     const order = new Order({
//       user: orderData.userId,
//       items: orderData.items,
//       shippingAddress: orderData.shippingAddress,
//       paymentMethod: 'stripe',
//       paymentResult: {
//         id: orderData.paymentIntentId,
//         status: 'succeeded',
//         update_time: new Date()
//       },
//       taxPrice: orderData.taxPrice || 0,
//       shippingPrice: orderData.shippingPrice || 0,
//       isPaid: true,
//       paidAt: new Date(),
//       orderStatus: 'confirmed',
//       stripePaymentIntentId: orderData.paymentIntentId
//     });

//     // Total will be calculated automatically by pre-save middleware
//     const savedOrder = await order.save();
//     return savedOrder;
//   } catch (error) {
//     throw new Error(`Order creation failed: ${error.message}`);
//   }
// };

// // Example of updating order status
// const updateOrderStatus = async (orderId, newStatus) => {
//   try {
//     const order = await Order.findById(orderId);
//     if (!order) {
//       throw new Error('Order not found');
//     }
    
//     await order.updateStatus(newStatus);
//     return order;
//   } catch (error) {
//     throw new Error(`Status update failed: ${error.message}`);
//   }
// };

// // Example of finding user orders with populated product data
// const getUserOrders = async (userId) => {
//   try {
//     const orders = await Order.find({ user: userId })
//       .populate('user', 'name email')
//       .populate('items.product', 'name image price')
//       .sort({ createdAt: -1 });
    
//     return orders;
//   } catch (error) {
//     throw new Error(`Failed to fetch orders: ${error.message}`);
//   }
// };
// */
