const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

// add to cart
const addToCartItem = TryCatchMiddleware(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    throw new AppError("Invalid data Provide");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found!!");
  }
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }
  const currentProductIndex = cart.items.findIndex(
    (item) => item?.productId?.toString() === productId
  );
  if (currentProductIndex === -1) {
    cart.items.push({ productId, quantity });
  } else {
    cart.items[currentProductIndex].quantity = quantity;
  }
  await cart.save();
  res.status(200).json({
    success: true,
    message: "",
    data: cart,
  });
});

// fetch cart
const fetchAllCartItem = TryCatchMiddleware(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new AppError("UserId not found!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found!!");
  }
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image name price salesPrice",
  });
  if (!cart) {
    throw new AppError("Cart is not found!!");
  }
  res.status(200).json({
    success: true,
    message: "",
    data: cart,
  });
});

// update cart
const updateCartItem = TryCatchMiddleware(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    throw new AppError("Invalid data provide!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found, please give valid user!!");
  }
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError("Cart is not found for this user!!");
  }
  const productIndex = cart.items.findIndex(
    (item) => item.productId?._id.toString() === productId
  );
  if (productIndex == -1) {
    throw new AppError("Product is not found in cart!!");
  }
  cart.items[productIndex].quantity = quantity;
  await cart.save();
  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });
  const populateCartItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: {
      ...cart._doc,
      items: populateCartItems,
    },
  });
});

// delete cart
const deleteCartItem = TryCatchMiddleware(async (req, res) => {
  const { userId, productId } = req.params;
  if (!userId || !productId) {
    throw new AppError("Invalid data provide!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found, please give valid user!!");
  }
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salesPrice",
  });
  if (!cart) {
    throw new AppError("Cart not found!!");
  }
  const productIndex = cart.items.findIndex(
    (item) => item.productId?._id.toString() === productId
  );
  if (productIndex == -1) {
    throw new AppError("Product is not found in cart!!");
  }
  cart.items = cart.items.filter(
    (item) => item.productId._id.toString() !== productId
  );
  await cart.save();
  await cart.populate({
    path: "items.productId",
    select: "image title salesPrice price",
  });
  const populateItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));
  res.status(200).json({
    success: true,
    message: "Product deleted successfully!!",
    data: populateItems,
  });
});

module.exports = {
  addToCartItem,
  fetchAllCartItem,
  updateCartItem,
  deleteCartItem,
};
