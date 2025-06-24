const express = require("express");
const productRouterUser = require("./ProductRouteUser");
const cartRoute = require("./CartRoute");
const addressRoute = require("./AddressRouteUser");
const orderRouter = require("./OrderRouteUser");
const reviewRouter = require("./ReviewRoute");
const searchRouter = require("./SearchRoute");

const userRouter = express.Router();

// orders

// products
userRouter.use("/products", productRouterUser);

// cart
userRouter.use("/Carts", cartRoute);

// address
userRouter.use("/address", addressRoute);

// order
userRouter.use("/orders", orderRouter);

// review
userRouter.use("/review", reviewRouter)

// search
userRouter.use("/search", searchRouter)

module.exports = userRouter;
