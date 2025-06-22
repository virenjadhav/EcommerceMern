const { imageUploadUtil } = require("../../helpers/cloudinary");
const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const AppError = require("../../utils/AppError");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

const createProduct = TryCatchMiddleware(async (req, res) => {
  const {
    image,
    name,
    description,
    price,
    salesPrice,
    averageReview,
    totalQuantity,
    category,
    brand,
  } = req.body;
  if (!name || !price || !totalQuantity) {
    throw new AppError("Please provide name, price and totalQuantity");
  }
  const cat = await Category.findOne({ name: category });
  if (!cat) {
    throw new AppError("Please provide valid category");
  }
  const brandd = await Brand.findOne({ name: brand });
  if (!brandd) {
    throw new AppError("Please Provide valid Brand");
  }
  if (price < salesPrice) {
    throw new AppError("Please Price is cannot be less than Sales Price!!");
  }
  const newProduct = new Product({
    image,
    name,
    description,
    price,
    salesPrice,
    averageReview,
    totalQuantity,
    category: cat,
    brand: brandd,
  });
  await newProduct.save();

  // Populate the category and brand names
  //  const populatedProduct = await Product.findById(newProduct._id)
  //  .populate('category', 'name')
  //  .populate('brand', 'name');

  const responseData = {
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
    salesPrice: newProduct.salesPrice,
    averageReview: newProduct.averageReview,
    totalQuantity: newProduct.totalQuantity,
    category: cat,
    brand: brandd,
    _id: newProduct._id,
  };
  res.status(201).json({
    success: true,
    message: "Product is created successfully!",
    data: responseData,
  });
});

// fetch all products
const fetchAllProducts = TryCatchMiddleware(async (req, res) => {
  const products = await Product.find({})
    .select("-__v -createdAt -updatedAt")
    .populate("category", "name")
    .populate("brand", "name")
    .lean();
    const transformedProducts = products.map((product) => ({
    ...product,
    category: product.category?.name || null,
    brand: product.brand?.name || null,
  }));
  res.status(200).json({
    message: "",
    success: true,
    data: transformedProducts,
  });
});

const getProduct = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Not valid type of request. Id is missing.");
  }
  const product = await Product.findById(id)
    .select("-__v -createdAt -updatedAt")
    .populate("category", "name")
    .populate("brand", "name")
    .lean();
  if (!product) {
    throw new AppError("Product Not found");
  }
  res.status(200).json({
    success: true,
    message: "",
    data: product,
  });
});

// update product
const editProduct = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Not valid type of request. Id is missing.");
  }
  const {
    name,
    description,
    price,
    salesPrice,
    averageReview,
    totalQuantity,
    category,
    brand,
  } = req.body;
  // if (!name || !price || !totalQuantity) {
  //   throw new AppError("Please provide name, price and totalQuantity");
  // }
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product is not found");
  }
  let brandd;
  if (brand) {
    brandd = await Brand.findOne({ name: brand });
    if (!brandd) {
      throw new AppError("Please Provide valid Brand");
    }
  } else {
    brandd = product.brand;
  }
  let cat;
  if (category) {
    cat = await Category.findOne({ name: category });
    if (!cat) {
      throw new AppError("Please provide valid category");
    }
  } else {
    cat = product.category;
  }
  if (price < salesPrice) {
    throw new AppError("Please Price is cannot be less than Sales Price!!");
  }
  product.name = name ? name : product.name;
  product.description = description ? description : product.description;
  product.price = price !== undefined ? price : product.price;
  product.salesPrice =
    salesPrice !== undefined ? salesPrice : product.salesPrice;
  product.averageReview = averageReview ? averageReview : product.averageReview;
  product.totalQuantity = totalQuantity ? totalQuantity : product.totalQuantity;
  product.category = cat;
  product.brand = brandd;

  await product.save();
  const responseData = {
    name: product.name,
    description: product.description,
    price: product.price,
    salesPrice: product.salesPrice,
    averageReview: product.averageReview,
    totalQuantity: product.totalQuantity,
    category: {
      name: product.category.name,
      _id: product.category._id,
    },
    brand: {
      name: product.brand.name,
      _id: product.brand._id,
    },
    _id: product._id,
  };
  res.status(201).json({
    success: true,
    message: "Product is update successfully!",
    data: responseData,
  });
});

// delete product
const deleteProduct = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Not valid type of request. Id is missing.");
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError("Product is not found!!");
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully!!",
  });
});

module.exports = {
  createProduct,
  fetchAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  handleImageUpload
};
