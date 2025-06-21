const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/ProductController");

const productRouter = express.Router();

// create product
productRouter.post("/", createProduct);

// fetch product
productRouter.get("/", fetchAllProducts);

// get product
productRouter.get("/:id", getProduct);

// update product
productRouter.put("/:id", editProduct);

// delete product
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
