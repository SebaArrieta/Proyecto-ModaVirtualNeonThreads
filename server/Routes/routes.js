const express = require("express");
const router = express.Router();
const ProductsViewController = require("../Controllers/ProductsViewController");

router.get("/GetProduct", ProductsViewController.GetProducts);

module.exports = router;