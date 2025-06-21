const constant = require("../constants/constant");
const AppError = require("../utils/AppError");
const TryCatchMiddleware = require("./TryCatchMiddleware");

const adminMiddleware = TryCatchMiddleware(async (req, res, next) => {
  const user = req.user;
  if (user?.role !== constant.admin) {
    throw new AppError("Admin access required", 403);
  }
  req.user = user;
  next();
});
module.exports = adminMiddleware;
