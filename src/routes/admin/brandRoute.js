const express = require("express");
const {
  createBrand,
  fetchAllBrands,
  getBrandController,
  editBrandController,
  deleteBrandController,
} = require("../../controllers/admin/BrandController");

const brandRouter = express.Router();

// create Brand
brandRouter.post("/", createBrand);
brandRouter.get("/", fetchAllBrands);
brandRouter.get("/:id", getBrandController);
brandRouter.put("/:id", editBrandController);
brandRouter.delete("/:id", deleteBrandController);

module.exports = brandRouter;
