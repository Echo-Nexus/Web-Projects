const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/adminController");

adminRouter.get("/add-products", adminController.getAddProducts)
adminRouter.get("/products", adminController.getAdminProducts);
adminRouter.post("/product-added", adminController.postSuccess);
adminRouter.post("/delete-product/:productId", adminController.postDeleteProduct);
adminRouter.get("/edit-product/:productId", adminController.getEditProduct);
adminRouter.post("/success", adminController.postEditProduct);
exports.adminRouter = adminRouter;