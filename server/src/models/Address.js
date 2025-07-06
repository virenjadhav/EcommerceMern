const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: String,
    city: String,
    pincode: String,
    country: String,
    phone: {
      type: Number,
      required: true,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
