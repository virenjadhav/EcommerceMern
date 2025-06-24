const express = require("express");
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/user/ReviewController");

const reviewRouter = express.Router();

reviewRouter.post("/add", addProductReview);
reviewRouter.get("/:productId", getProductReviews);

module.exports = reviewRouter;
