const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Brand", brandSchema);
