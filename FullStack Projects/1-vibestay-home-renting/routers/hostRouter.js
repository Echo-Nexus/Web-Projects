const express = require("express");
const hostRouter = express.Router();
const hostController = require("../controllers/hostController");

hostRouter.get('/', hostController.getAddHome);
hostRouter.post("/homeAdded", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHome);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/homeUpdated", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);
exports.hostRouter = hostRouter;