const express = require("express");
const {
  addAddress,
  editAddress,
  fetchAllAddress,
  deleteAddress,
} = require("../../controllers/user/AddressController");

const addressRoute = express.Router();

addressRoute.get("/:userId", fetchAllAddress);
addressRoute.post("/", addAddress);
addressRoute.put("/:userId/:addressId", editAddress);
addressRoute.delete("/:userId/:addressId", deleteAddress);

module.exports = addressRoute;
