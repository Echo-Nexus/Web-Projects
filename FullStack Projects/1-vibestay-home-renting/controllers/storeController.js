const path = require("path");
const rootDir = require("../utils/pathUtils");
const Home = require("../models/homes");
const Favourite = require("../models/favourite");

exports.getIndex = (req, res, next) => {
  res.render("store/index");
};

exports.getHome = (req, res, next) => {
  Home.fetchAll().then((registeredHome) => {
    res.render("store/homeList", { homes: registeredHome });
  }).catch(err => console.log("Error fetching homes:", err));
};

exports.bookings = (req, res, next) => {
  res.render("store/bookings");
};

exports.homeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId).then(home => {
    if (!home) {
            res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
    }
    res.render("store/homeDetails", {
      homeId: req.params.homeId,
      editing: editing,
      home: home,
    });
  });
};

exports.reserve = (req, res, next) => {
  res.render("store/reserve");
};

exports.getFavouriteList = (req, res, next) => {
  Home.fetchAll().then(registeredHome => {
    Favourite.getFavourites().then(favourites => {
      favourites = favourites.map(fav => fav.homeId);
      const favouriteHomes = registeredHome.filter((home) =>
        favourites.includes(home._id.toString())
      );
      res.render("store/favouriteList", { favouritesHome: favouriteHomes });
    });
  }).catch(err => console.log("Error fetching homes:", err));
};

exports.postAddToFavourites = (req, res, next) => {
  const homeId = req.body.id;
  const fav = new Favourite(homeId);
  fav.save().then((result) => {
    console.log("Home added to favourites successfully", result);
  }).catch(err => {
    console.log("Error adding home to favourites:", err);
  }).finally(() => {
    res.redirect("/favourite-list")}
  );
};

exports.postDeleteFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.deleteFromFavourite(homeId).then(() => {
    res.redirect("/favourite-list");
  }).catch(err => console.log("Error deleting home from favourites:", err));
};