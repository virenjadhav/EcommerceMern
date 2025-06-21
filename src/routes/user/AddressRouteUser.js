const express = require("express");
const {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../../controllers/user/AddressController");

const addressRoute = express.Router();

addressRoute.get("/:userId", getAddress);
addressRoute.post("/", createAddress);
addressRoute.put("/:userId/:addressId", updateAddress);
addressRoute.delete("/:userId/:addressId", deleteAddress);

module.exports = addressRoute;
