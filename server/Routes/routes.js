const express = require("express");
const router = express.Router();
const ProductsViewController = require("../Controllers/ProductsViewController");
const UserController = require("../Controllers/UserController");
const CompraController = require("../Controllers/CompraController")
const verifyToken = require('../middleware/Auth');

router.get("/GetProduct", ProductsViewController.GetProducts);
router.post("/SignUp", UserController.SignUp);
router.post("/Login", UserController.Login);
router.get("/Comprar", verifyToken, CompraController.Prueba)

module.exports = router;