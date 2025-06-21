const express = require("express");
const {
  createCategory,
  getCategoryController,
  fetchAllCategoryController,
  deleteCategoryController,
  editCategoryController,
} = require("../../controllers/admin/CategoryController");

const categoryRoutes = express.Router();

// create category
categoryRoutes.post("/", createCategory);
categoryRoutes.get("/:id", getCategoryController);
categoryRoutes.get("/", fetchAllCategoryController);
categoryRoutes.delete("/:id", deleteCategoryController);
categoryRoutes.put("/:id", editCategoryController);

module.exports = categoryRoutes;
