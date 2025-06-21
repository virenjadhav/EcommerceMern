const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Category = require("../../models/Category");
const AppError = require("../../utils/AppError");

const createCategory = TryCatchMiddleware(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new AppError("Name cannot be blank!");
  }
  const nameCategory = await Category.find({ name });
  if (nameCategory.length > 0) {
    throw new AppError("Category is alredy exist");
  }
  const newCategory = new Category({
    name,
    description,
  });
  await newCategory.save();
  res.status(201).json({
    success: true,
    message: "Category created successfully!",
    categoryId: newCategory._id,
  });
});

// get all category
const fetchAllCategoryController = TryCatchMiddleware(async (req, res) => {
  const allCategories = await Category.find({}).select({
    name: 1,
    description: 1,
    _id: 1,
  });
  res.status(200).json({
    success: true,
    message: "",
    categories: allCategories,
  });
});

// edit category
const editCategoryController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category is not exist");
  }
  if (name) {
    const extCat = await Category.find({ name });
    if (Object.entries(extCat).length > 0) {
      throw new AppError(`Category ${name} is already exist`);
    }
  }
  category.name = name ? name : category.name;
  category.description =
    description !== undefined ? description : category.description;
  await category.save();
  res.status(200).json({
    success: true,
    message: "Category is successfully updated.",
    category: {
      id: category._id,
      name: category.name,
      description: category.description,
    },
  });
});

const deleteCategoryController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError("Category is not exist");
  }
  res.status(200).json({
    success: true,
    message: "Category is deleted successfully!",
  });
});

const getCategoryController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category is not exist");
  }
  res.status(200).json({
    success: true,
    message: "",
    category: {
      id: category._id,
      name: category.name,
      description: category.description,
    },
  });
});

module.exports = {
  createCategory,
  fetchAllCategoryController,
  editCategoryController,
  deleteCategoryController,
  getCategoryController,
};
