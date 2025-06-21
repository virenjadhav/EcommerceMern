const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Address = require("../../models/Address");
const User = require("../../models/User");
const AppError = require("../../utils/AppError");

const createAddress = TryCatchMiddleware(async (req, res) => {
  const { userId, address, city, pincode, phone, notes } = req.body;
  if (!userId || !address || !city || !pincode || !phone) {
    throw new AppError("please provide all the required fields", 400);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found!!");
  }
  const newAddress = new Address({
    userId: user,
    address,
    city,
    pincode,
    phone,
    notes,
  });
  await newAddress.save();
  await newAddress.populate({
    path: "userId",
    select: "username email role",
  });
  res.status(200).json({
    success: true,
    message: "Address created successfully!!",
    data: newAddress,
  });
});
const getAddress = TryCatchMiddleware(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new AppError("User id is not found!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found!!");
  }
  const addresses = await Address.find({ userId: userId })
    .select("address city pincode phone notes userId")
    .populate({
      path: "userId",
      select: "username email role",
    });
  if (!addresses || Object.entries(addresses).length <= 0) {
    throw new AppError("Address not found for this user!");
  }
  res.status(200).json({
    success: true,
    message: "",
    data: addresses,
  });
});
const updateAddress = TryCatchMiddleware(async (req, res) => {
  const { userId, addressId } = req.params;
  const { address, city, pincode, phone, notes } = req.body;
  if (!userId) {
    throw new AppError("User id is not found!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found!!");
  }
  const currAddress = await Address.findOne({ _id: addressId, userId }).select(
    "address city pincode phone notes userId"
  );
  if (!currAddress) {
    throw new AppError("Address is not found!!");
  }
  currAddress.address = address ? address : currAddress.address;
  currAddress.city = city ? city : currAddress.city;
  currAddress.pincode = pincode ? pincode : currAddress.pincode;
  currAddress.phone = phone ? phone : currAddress.phone;
  currAddress.notes = notes ? notes : currAddress.notes;
  await currAddress.save();
  await currAddress.populate({
    path: "userId",
    select: "username email role",
  });
  res.status(200).json({
    success: true,
    message: "Address updated successfully!!",
    data: currAddress,
  });
});
const deleteAddress = TryCatchMiddleware(async (req, res) => {
  const { userId, addressId } = req.params;
  if (!userId) {
    throw new AppError("User id is not found!!");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User is not found!!");
  }
  const currAddress = await Address.findOneAndDelete({
    _id: addressId,
    userId,
  }).select("address city pincode phone notes userId");
  if (!currAddress) {
    throw new AppError("Address is not found!!");
  }
  res.status(200).json({
    success: true,
    message: "Addess Deleted Successfully!!",
    data: currAddress,
  });
});
module.exports = { createAddress, getAddress, updateAddress, deleteAddress };
