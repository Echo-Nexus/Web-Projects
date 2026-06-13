const path = require("path");
const rootDir = require("../utils/pathUtils");
const Products = require("../models/product");
const Users = require("../models/user");
const { slugify } = require("../utils/slugify");
const { title } = require("process");


exports.getProfile = (req, res, next) => {
    res.render("user/profile", { 
      title: "Profile", 
      isLoggedIn: req.isLoggedIn,
      user: req.user,
    });
};

exports.getWishlist = (req, res, next) => {
  res.render("user/wishlist", { title: "Wishlist", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

// exports.getWishlist = async (req, res, next) => {
//   try {
//     const userId = req.session.userId;
//     const user = await Users.findById(userId).populate('wishlist');
//     res.render("user/wishlist", { wishlist: user.wishlist, title: "Wishlist", isLoggedIn: req.isLoggedIn, user: req.user,});
//   } catch (err) {
//     console.log("Error fetching user:", err);
//   }
  
// };

// exports.postWishlist = async (req, res, next) => {
//   try {
//     const productId = req.body.id;
//     const userId = req.session.userId;
//     const user = await Users.findById(userId);
//     if (!user.wishlist.includes(productId)){
//       user.wishlist.push(productId);
//       await user.save();  
//     }
//     res.redirect("/user/wishlist");
//   }
//   catch (err) {
//     console.log("Error fetching user:", err);
//   }
// };

exports.getCart = (req, res, next) => {
  res.render("user/cart", { title: "Cart", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

exports.getOrders = (req, res, next) => {
  res.render("user/orders", { title: "Orders", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};