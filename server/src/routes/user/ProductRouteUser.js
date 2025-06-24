const express = require("express");
const {
  fetchAllProductsUser,
  getProductUser,
} = require("../../controllers/user/UserProductController");

const productRouterUser = express.Router();

// fetch all
productRouterUser.get("/", fetchAllProductsUser);

// get product
productRouterUser.get("/:id", getProductUser);

module.exports = productRouterUser;
