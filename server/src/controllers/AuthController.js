const constant = require("../constants/constant");
const TryCatchMiddleware = require("../middlewares/TryCatchMiddleware");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const signupController = (req, res) => {
//   res.status(200).json({
//     message: "Signup controller access suceessfully.",
//   });
// };

// const signupController = async (req, res) => {
//   res.status(500).json({
//     success: false,
//     message: "Some error occured",
//   });
// };
const signupController = TryCatchMiddleware(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    throw new AppError(
      "Please Provide username, email and password for register user!",
      500
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new AppError("User is already exist with this Email.");
  }
  const userWithName = await User.findOne({ username });
  if (userWithName) {
    throw new AppError("User is already exist with this Username.");
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: role ? constant?.[role] : constant.user,
  });
  await newUser.save();
  res.status(201).json({
    success: true,
    message: "User registerd successfully!",
  });
});

// login service
const loginController = TryCatchMiddleware(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    throw new AppError(
      "Please Provide username, email and password for register user!",
      500
    );
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");
  if (!user) {
    throw new AppError(
      `User not register with this ${
        email ? "email" : "username"
      }. Please Register first`
    );
  }
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    throw new AppError("Password is incorrect, Please try again");
  }
  const token = await jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "60m",
    }
  );
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message: "Logged in successfully.",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        username: user.username,
      },
    });
});

// logout
const logoutController = TryCatchMiddleware((req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
});

const checkAuthController = TryCatchMiddleware((req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "",
    user,
  });
});

module.exports = {
  signupController,
  loginController,
  logoutController,
  checkAuthController,
};
