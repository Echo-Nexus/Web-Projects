const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/profile", userController.getProfile);
userRouter.get("/wishlist", userController.getWishlist);
userRouter.get("/cart", userController.getCart);
userRouter.get("/orders", userController.getOrders);

exports.userRouter = userRouter;