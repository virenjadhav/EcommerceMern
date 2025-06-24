const express = require("express");
const {
  addToCartItem,
  updateCartItem,
  fetchAllCartItem,
  deleteCartItem,
} = require("../../controllers/user/CartController");

const cartRoute = express.Router();

// add to cart
cartRoute.post("/add", addToCartItem);

// fetch all cart
cartRoute.get("/get/:userId", fetchAllCartItem);

// update cart
cartRoute.put("/updateCart", updateCartItem);

// delete cart
cartRoute.delete("/:userId/:productId", deleteCartItem);

module.exports = cartRoute;
