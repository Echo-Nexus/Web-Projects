const express = require("express");
const storeRouter = express.Router();
const storeController = require("../controllers/storeController");

storeRouter.get("/products", storeController.getProducts);
storeRouter.get("/deals", storeController.getDeals);
storeRouter.get("/new-arrival", storeController.getNewArrivals);
storeRouter.get("/privacy-policy", storeController.getPrivacyPolicy);
storeRouter.get("/terms", storeController.getTerms);
storeRouter.get("/support", storeController.getSupport);
storeRouter.get("/help-center", storeController.getHelpCenter);
storeRouter.get("/products/details/:productId", storeController.getDetails);
storeRouter.get("/categories", storeController.getCategories);
storeRouter.get("/category/:category", storeController.getCategory);
exports.storeRouter = storeRouter;