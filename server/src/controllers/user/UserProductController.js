const constant = require("../../constants/constant");
const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const AppError = require("../../utils/AppError");

const fetchAllProductsUser = TryCatchMiddleware(async (req, res) => {
  const { category = {}, brand = {}, sortBy = "price-lowToHigh" } = req.query;
  let filters = {};
  if (category.length) {
    const categories = category.split(",").map((cat) => cat.trim());
    const categoryDocs = await Category.find({ name: { $in: categories } });
    filters.category = { $in: categoryDocs.map((cat) => cat._id) };
  }
  if (brand.length) {
    const brands = brand.split(",").map((br) => br.trim());
    const brandDocs = await Brand.find({ name: { $in: brands } });
    filters.brand = { $in: brandDocs.map((br) => br._id) };
  }
  let sortData = {};
  switch (sortBy) {
    case constant.priceLowToHigh:
      sortData.price = 1;
      break;
    case constant.priceHighToLow:
      sortData.price = -1;
      break;
    case constant.titleAtoZ:
      sortData.name = 1;
      break;
    case constant.titleZtoA:
      sortData.name = -1;
      break;
    default:
      sortData.price = 1;
      break;
  }
  const allProducts = await Product.find(filters)
    .sort(sortData)
    .select("-__v -createdAt -updatedAt")
    .populate("category", "name description ")
    .populate("brand", "name description ")
    .lean();
  const transformedProducts = allProducts.map((product) => ({
    ...product,
    category: product.category?.name || null,
    brand: product.brand?.name || null,
  }));
  res.status(200).json({
    success: true,
    message: "",
    data: transformedProducts,
  });
});

const getProductUser = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Id is missing");
  }
  const product = await Product.findById(id)
    .select("-__v -createdAt -updatedAt")
    .populate("category", "name description ")
    .populate("brand", "name description ")
    .lean();
  const transformedProducts = {
    ...product,
    category: product.category?.name || null,
    brand: product.brand?.name || null,
  };
  res.status(200).json({
    success: true,
    message: "",
    data: transformedProducts,
  });
});
module.exports = { fetchAllProductsUser, getProductUser };
