const express = require("express");
const router = express.Router();
const ProductsViewController = require("../Controllers/ProductsViewController");
const UserController = require("../Controllers/UserController");
const CompraController = require("../Controllers/CompraController")
const AddProductController = require("../Controllers/AddProductController")
const verifyToken = require('../middleware/Auth');

router.get("/GetProduct", ProductsViewController.GetProducts);
router.get("/GetStock", ProductsViewController.GetStock);
router.get("/GetCart", verifyToken, CompraController.GetCart);
router.get("/GetCompra", verifyToken, CompraController.GetCompra);
router.get("/getUser", verifyToken, UserController.getUser);
router.get("/getPaymentMethodUser", verifyToken, UserController.getPaymentMethodUser);
router.post("/DeleteCart", verifyToken, CompraController.DeleteCart);
router.post("/ModifyQuantity", verifyToken, CompraController.ModifyQuantity);
router.get("/GetStock", ProductsViewController.GetStock);
router.get("/GetCart", verifyToken, CompraController.GetCart);
router.get("/GetCompra", verifyToken, CompraController.GetCompra);
router.get("/getUser", verifyToken, UserController.getUser);
router.get("/getPaymentMethodUser", verifyToken, UserController.getPaymentMethodUser);
router.post("/DeleteCart", verifyToken, CompraController.DeleteCart);
router.post("/ModifyQuantity", verifyToken, CompraController.ModifyQuantity);
router.post("/SignUp", UserController.SignUp);
router.post("/Login", UserController.Login);
router.post("/deleteUser", verifyToken, UserController.DeleteUser);
router.post("/AddCart", verifyToken, CompraController.AddCart);
router.post("/PostPaymentMethodUser", verifyToken, UserController.PostPaymentMethodUser);
router.post("/DeletePaymentMethodUser", verifyToken, UserController.DeletePaymentMethodUser);
router.post("/MakeCompra", verifyToken, CompraController.MakeCompra);
router.post("/AddProductTest", verifyToken, ProductsViewController.AddProductTest);
router.post("/DeleteProductTest", verifyToken, ProductsViewController.DeleteProductTest);
router.post("/deleteUser", verifyToken, UserController.DeleteUser);
router.post("/AddCart", verifyToken, CompraController.AddCart);
router.post("/PostPaymentMethodUser", verifyToken, UserController.PostPaymentMethodUser);
router.post("/DeletePaymentMethodUser", verifyToken, UserController.DeletePaymentMethodUser);
router.post("/MakeCompra", verifyToken, CompraController.MakeCompra);
router.post("/AddProduct", AddProductController.AddProduct);


module.exports = router;