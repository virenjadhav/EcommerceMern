const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  checkAuthController,
} = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/AuthMiddleware");

const AuthRouter = express.Router();

// sign up
AuthRouter.post("/signup", signupController);

// login
AuthRouter.post("/login", loginController);

// logout
AuthRouter.delete("/logout", logoutController);

// check auth
AuthRouter.get("/checkAuth", authMiddleware, checkAuthController);

module.exports = AuthRouter;
