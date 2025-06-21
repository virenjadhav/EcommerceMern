const express = require("express");
const productRouter = require("./productRoute");
const orderRouter = require("./orderRouter");
const categoryRoutes = require("./categoryRoute");
const brandRouter = require("./brandRoute");

const adminRouter = express.Router();

// product
adminRouter.use("/products", productRouter);

// orders
adminRouter.use("/orders", orderRouter);

// category
adminRouter.use("/categories", categoryRoutes);

//brand
adminRouter.use("/brands", brandRouter);

module.exports = adminRouter;
