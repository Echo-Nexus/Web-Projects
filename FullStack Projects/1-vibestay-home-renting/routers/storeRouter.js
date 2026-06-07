const express = require("express");
const storeRouter = express.Router();
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/home-list", storeController.getHome);
storeRouter.get("/bookings", storeController.bookings);
storeRouter.get("/favourite-list", storeController.getFavouriteList);
storeRouter.get("/home-list/home-details/:homeId", storeController.homeDetails);
storeRouter.get("/reserve", storeController.reserve);
storeRouter.post("/favourite-list", storeController.postAddToFavourites);
storeRouter.post("/favourites/:homeId", storeController.postDeleteFromFavourite);
exports.storeRouter = storeRouter;