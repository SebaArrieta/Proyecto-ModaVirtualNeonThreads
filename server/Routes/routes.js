const express = require("express");
const router = express.Router();
const ProductsViewController = require("../Controllers/ProductsViewController");
const UserController = require("../Controllers/UserController");
const CompraController = require("../Controllers/CompraController")
const verifyToken = require('../middleware/Auth');

router.get("/GetProduct", ProductsViewController.GetProducts);
router.get("/GetStock", ProductsViewController.GetStock);
router.get("/GetCart", verifyToken, CompraController.GetCart);
router.get("/GetCompra", verifyToken, CompraController.GetCompra);
router.get("/getUser", verifyToken, UserController.getUser);
router.get("/getPaymentMethodUser", verifyToken, UserController.getPaymentMethodUser);
router.post("/DeleteCart", verifyToken, CompraController.DeleteCart);
router.post("/ModifyQuantity", verifyToken, CompraController.ModifyQuantity);
router.post("/SignUp", UserController.SignUp);
router.post("/Login", UserController.Login);
router.post("/AddCart", verifyToken, CompraController.AddCart);
router.post("/PostPaymentMethodUser", verifyToken, UserController.PostPaymentMethodUser);
router.post("/DeletePaymentMethodUser", verifyToken, UserController.DeletePaymentMethodUser);
router.post("/MakeCompra", verifyToken, CompraController.MakeCompra);

module.exports = router;