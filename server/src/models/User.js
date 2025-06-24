const { default: mongoose } = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Username"],
      trim: true,
      unique: true,
      maxLength: [50, "Username connot be more than 50 character"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please Provide a valid Email."],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minLength: 8,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
