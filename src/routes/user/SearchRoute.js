const express = require("express");
const { searchProducts } = require("../../controllers/user/SearchController");

const searchRouter = express.Router();

searchRouter.get("/:keyword", searchProducts);

module.exports = searchRouter;
