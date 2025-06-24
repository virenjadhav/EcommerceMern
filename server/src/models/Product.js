const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: String,
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    salesPrice: { type: Number, default: 0 },
    averageReview: Number,
    totalQuantity: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
