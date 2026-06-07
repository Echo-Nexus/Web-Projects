const path = require("path");
const rootDir = require("../utils/pathUtils");
const Home = require("../models/homes");
const Favourite = require("../models/favourite");

exports.getAddHome = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "host", "addHome.html"));
};

exports.postAddHome = (req, res, next) => {
  const {id, homeName, image, description, location, price } = req.body;
  const home = new Home(id, homeName, image, description, location, price);
  home.save().then(() => {
    console.log("Home added successfully");
  });
  res.sendFile(path.join(rootDir, "views", "host", "homeAdded.html"));
};

exports.getHostHome = (req, res, next) => {
  Home.fetchAll().then((registeredHome) => {
    res.render("host/hostHomeList", { homes: registeredHome });
  }).catch(err => console.log("Error fetching homes:", err));
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId).then(home => {
    if (!home) {
      return res.redirect("/host/host-home-list");
    }
    res.render("host/editHome", {
      homeId: req.params.homeId,
      editing: editing,
      home: home,
    });
  });
};

exports.postEditHome = (req, res, next) => {
  const { id, homeName, image, description, location, price } = req.body;
  const home = new Home(id, homeName, image, description, location, price);
  home.save().then((result) => {
    console.log("Home updated successfully", result);
  }).catch(err => console.log("Error updating home:", err));
  res.redirect("/host/host-home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
    // Favorite.deleteFromFavourite(homeId, (err) => {
    //   if (err) {
    //     console.error("Error occurred while deleting from favourites:", err);
    //   }
    // });
  Home.deleteById(homeId).then(() => {res.redirect("/host/host-home-list");}).catch(err => console.log("Error deleting home:", err));
};