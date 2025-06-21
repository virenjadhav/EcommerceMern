const express = require("express");
const productRouterUser = require("./ProductRouteUser");
const cartRoute = require("./CartRoute");
const addressRoute = require("./AddressRouteUser");
const orderRouter = require("./OrderRouteUser");

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

module.exports = userRouter;
