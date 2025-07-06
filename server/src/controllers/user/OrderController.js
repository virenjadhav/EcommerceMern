const { transporter, nodemailer } = require("../../helpers/nodemailerService");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart")
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.createPaymentIntent = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      userId,
      taxPrice = 0,
      shippingPrice = 0,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in cart",
      });
    }
    const invalidItems = items.filter(
      (item) => !mongoose.isValidObjectId(item.productId)
    );
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid product IDs: ${invalidItems
          .map((i) => i.productId)
          .join(", ")}`,
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Verify products exist and get current prices
    const productIds = items.map((item) =>
      new ObjectId(item.productId)
    );

    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products not found",
      });
    }
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User is not found!"
      })
    }
    // Calculate total with current prices
    let itemsPrice = 0;
    const validatedItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      // Check stock
      if (product.totalQuantity < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }
      const productPrice = product.salesPrice
        ? product.salesPrice
        : product.price;
      const itemTotal = productPrice * item.quantity;
      itemsPrice += itemTotal;

      return {
        productId: product._id,
        name: product.name,
        price: productPrice,
        quantity: item.quantity,
        image: product.image,
      };
    });
    const totalAmount = itemsPrice + taxPrice + shippingPrice;
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId,
        itemsCount: items.length.toString(),
        itemsPrice: itemsPrice.toString(),
        taxPrice: taxPrice.toString(),
        shippingPrice: shippingPrice.toString(),
      },
    });
    // create order with pending status

    const order = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: userId,
      status: 'processing',
      taxPrice,
      shippingPrice
    })
    await order.save();
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment intent",
    });
  }
};

// @desc    Confirm payment and create order
// @route   POST /api/orders/confirm-payment
// @access  Private
// exports.confirmPayment = async (req, res) => {
//   try {
//     const {
//       paymentIntentId,
//       items,
//       shippingAddress,
//       userId,
//       itemsPrice,
//       taxPrice = 0,
//       shippingPrice = 0,
//       totalAmount,
//     } = req.body;

//     // Verify payment with Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     console.log("payment", paymentIntent);
//     if (paymentIntent.status !== "succeeded") {
//       return res.status(400).json({
//         success: false,
//         message: "Payment not completed",
//       });
//     }

//     // Check if order already exists for this payment intent
//     const existingOrder = await Order.findOne({
//       stripePaymentIntentId: paymentIntentId,
//     });
//     if (existingOrder) {
//       return res.status(400).json({
//         success: false,
//         message: "Order already exists for this payment",
//         order: existingOrder,
//       });
//     }

//     // Update product stock
//     for (const item of items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { totalQuantity: -item.quantity },
//       });
//     }

//     // Create order in database
//     const order = new Order({
//       user: userId,
//       items: items.map((item) => ({
//         product: item.productId,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image,
//       })),
//       shippingAddress,
//       paymentMethod: "stripe",
//       paymentResult: {
//         id: paymentIntent.id,
//         status: paymentIntent.status,
//         update_time: new Date(),
//         email_address: paymentIntent.receipt_email || "",
//       },
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice: totalAmount,
//       isPaid: true,
//       paidAt: new Date(),
//       orderStatus: "confirmed",
//       stripePaymentIntentId: paymentIntentId,
//     });

//     const savedOrder = await order.save();

//     // Populate the order for response
//     const populatedOrder = await Order.findById(savedOrder._id)
//       .populate("user", "name email")
//       .populate("items.product", "name image");

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: populatedOrder,
//     });
//   } catch (error) {
//     console.error("Order Creation Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create order",
//     });
//   }
// };

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "name email")
//       .populate("items.product", "name image price");

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Check if user owns this order or is admin
//     if (
//       order.user._id.toString() !== req.user._id.toString() &&
//       !req.user.isAdmin
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to view this order",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch order",
//     });
//   }
// };

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
// exports.getUserOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;
//     const userId = req.params.userId;

//     // Check if user is accessing their own orders or is admin
//     if (userId !== req.user._id.toString() && !req.user.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to view these orders",
//       });
//     }

//     const query = { user: userId };
//     if (status) {
//       query.orderStatus = status;
//     }

//     const orders = await Order.find(query)
//       .populate("items.product", "name image price")
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Order.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       orders,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch orders",
//     });
//   }
// };

// @desc    Stripe webhook handler
// @route   POST /api/orders/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);

        const order =  await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            isPaid: true,
            paidAt: new Date(),
            orderStatus: "paid",
            "paymentResult.status": "succeeded",
          }
        );
        console.log("order updated successfully!!")
        const user = await User.findById(order.user._id)
        await Cart.findOneAndDelete({ userId: user._id });
        console.log("cart deleted successfully!!")
        const info =  await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Payment Successful',
          text: `Hi ${user.username}, your payment of $${order.totalPrice} was successful.`
        });
        console.log("email send successfully!!")
        console.log("Email sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);

        await Order.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          {
            orderStatus: "failed",
            "paymentResult.status": "failed",
          }
        );
        
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.user.email,
            subject: 'Payment Failed',
            text: `Hi ${order.user.name}, your payment attempt failed. Please try again.`
          });
          console.log("Email sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        break;

      // case "charge.dispute.created":
      //   const dispute = event.data.object;
      //   console.log("Dispute created:", dispute.id);
      //   // Handle dispute logic here
      //   break;

      default:
        // console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  res.status(200).json({ received: true });
};


// export async function sendTestEmail(toEmail) {
//   const info = await transporter.sendMail({
//     from: `"Shop Test 👻" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Test Email from Ethereal",
//     text: "This is a plain text test email.",
//     html: "<b>This is a test email sent using Nodemailer and Ethereal</b>",
//   });

//   console.log("Email sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }

exports.sendEmailToTest = async (req, res) => {
  try{
    let toEmail = "veeryadhav2288@gmail.com"
      const info = await transporter.sendMail({
        from: `"Shop Test 👻" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Test Email from Ethereal",
        text: "This is a plain text test email.",
        html: "<b>This is a test email sent using Nodemailer and Ethereal</b>",
      });
        console.log("Email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.status(200).json({
    success: true,
    message: info.messageId,
    url: nodemailer.getTestMessageUrl(info)
  }) 
  } catch(error){
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    })
  }
}



