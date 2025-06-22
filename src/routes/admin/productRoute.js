const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  handleImageUpload,
} = require("../../controllers/admin/ProductController");

const { upload } = require("../../helpers/cloudinary");

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


productRouter.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = productRouter;
