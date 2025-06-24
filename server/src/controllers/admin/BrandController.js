const TryCatchMiddleware = require("../../middlewares/TryCatchMiddleware");
const Brand = require("../../models/Brand");
const AppError = require("../../utils/AppError");

const createBrand = TryCatchMiddleware(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new AppError("Name cannot be blank!");
  }
  const nameBrand = await Brand.find({ name });
  if (nameBrand.length > 0) {
    throw new AppError("Brand is alredy exist");
  }
  const newBrand = new Brand({
    name,
    description,
  });
  await newBrand.save();
  res.status(201).json({
    success: true,
    message: "Brand created successfully!",
    brandId: newBrand._id,
  });
});

const fetchAllBrands = TryCatchMiddleware(async (req, res) => {
  const allBrands = await Brand.find({}).select({
    name: 1,
    description: 1,
    _id: 1,
  });
  res.status(200).json({
    success: true,
    message: "",
    brands: allBrands,
  });
});

const getBrandController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError("Brand is not exist");
  }
  res.status(200).json({
    success: true,
    message: "",
    brand: {
      id: brand._id,
      name: brand.name,
      description: brand.description,
    },
  });
});

const editBrandController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError("Brand is not exist");
  }
  if (name) {
    const extBrand = await Brand.find({ name });
    if (Object.entries(extBrand).length > 0) {
      throw new AppError(`Brand ${name} is already exist`);
    }
  }
  brand.name = name ? name : brand.name;
  brand.description =
    description !== undefined ? description : brand.description;
  await brand.save();
  res.status(200).json({
    success: true,
    message: "Brand is successfully updated.",
    brand: {
      id: brand._id,
      name: brand.name,
      description: brand.description,
    },
  });
});

const deleteBrandController = TryCatchMiddleware(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new AppError("Brand is not exist");
  }
  res.status(200).json({
    success: true,
    message: "Brand is deleted successfully!",
  });
});

module.exports = {
  createBrand,
  fetchAllBrands,
  getBrandController,
  editBrandController,
  deleteBrandController,
};
