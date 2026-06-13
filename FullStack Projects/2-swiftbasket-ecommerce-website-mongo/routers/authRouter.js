const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.get("/signup", authController.getSignup);
authRouter.get("/login", authController.getLogin);
authRouter.post("/signup", authController.postSignup);
exports.authRouter = authRouter;