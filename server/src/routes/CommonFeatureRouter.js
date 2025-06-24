const express = require("express");
const commonFeatureRouter = express.Router();
const {
  addFeatureImage,
  getFeatureImages,
} = require("../controllers/FeatureController");

commonFeatureRouter.post("/add", addFeatureImage);
commonFeatureRouter.get("/get", getFeatureImages);

module.exports = commonFeatureRouter;
