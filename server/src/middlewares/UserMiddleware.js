const constant = require("../constants/constant");
const AppError = require("../utils/AppError");
const TryCatchMiddleware = require("./TryCatchMiddleware");

const userMiddleware = TryCatchMiddleware(async (req, res, next) => {
  const user = req.user;
  if (user.role !== constant.user && user.role !== constant.admin) {
    throw new AppError("User access required", 403);
  }
  if (user.role === constant.admin) {
    throw new AppError("Admin is trying to hit user endpoints.");
  }
  req.user = user;
  next();
});
module.exports = userMiddleware;
