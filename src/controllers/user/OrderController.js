const paypal = require("../../helpers/Paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};

// const { paypal, client } = require("../../helpers/paypal");
// const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
// const AppError = require("../../utils/AppError");

// const createOrder = TryCatchMiddleware(async (req, res) => {
//   const { amount, items, description } = req.body;
//   if (!amount || !items || Object.entries(items).length <= 0 || !description) {
//     throw new AppError("plese provide all fields!!");
//   }
//   const request = new paypal.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   //   request.requestBody({
//   //     intent: "CAPTURE",
//   //     purchase_units: [
//   //       {
//   //         amount: {
//   //           currency_code: "USD",
//   //           value: amount,
//   //           breakdown: {
//   //             item_total: {
//   //               currency_code: "USD",
//   //               value: amount,
//   //             },
//   //           },
//   //         },
//   //         items: items || [],
//   //         description: description || "Purchase from our store!!",
//   //       },
//   //     ],
//   //     application_context: {
//   //       brand_name: "Viren shop",
//   //       landing_page: "BILLING",
//   //       user_action: "PAY_NOW",
//   //       return_url: `${process.env.FRONTEND_URL}/payment/success`,
//   //       cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
//   //     },
//   //   });
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: "USD",
//           value: "10.00",
//         },
//       },
//     ],
//   });
//   const order = await client().execute(request);
//   //   res.status(200).json({
//   //     success: true,
//   //     message: "Order created successfully",
//   //     data: {
//   //       id: order.result.id,
//   //     },
//   //   });
//   // Find the approval URL in the response links
//   const approveLink = order.result.links.find((link) => link.rel === "approve");

//   res.status(200).json({
//     success: true,
//     message: "",
//     data: {
//       orderID: order.result.id,
//       approvalURL: approveLink.href, // Send this to frontend
//       status: order.result.status,
//     },
//   });
// });

// const capturePaymentFromOrder = TryCatchMiddleware(async (req, res) => {
//   const { orderId } = req.params;

//   console.log("Orderid", orderId);

//   if (!orderId || typeof orderId !== "string") {
//     throw new AppError("Invalid PayPal order ID format");
//   }

//   const request = new paypal.orders.OrdersCaptureRequest(orderId);
//   request.requestBody({});

//   const capture = await client().execute(request);
//   return res.status(200).json({
//     success: true,
//     message: "Payment captured successfully",
//     data: {
//       status: capture.result.status,
//       capture_id: capture.result.purchase_units[0].payments.captures[0].id,
//       create_time: capture.result.create_time,
//       update_time: capture.result.update_time,
//     },
//   });
// });
// module.exports = { createOrder, capturePaymentFromOrder };
