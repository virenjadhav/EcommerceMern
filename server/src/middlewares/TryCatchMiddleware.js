require("dotenv").config();
const TryCatchMiddleware = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.stack : {},
    });

    // Or just pass to Express error middleware
    // next(error);
  }
};

module.exports = TryCatchMiddleware;
