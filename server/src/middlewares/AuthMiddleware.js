const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not found!!",
    });
  }
  try {
    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeUser) {
      throw new AppError("User not found", 404);
    }
    req.user = decodeUser;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = authMiddleware;
