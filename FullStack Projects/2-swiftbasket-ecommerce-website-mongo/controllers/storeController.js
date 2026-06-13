const path = require("path");
const rootDir = require("../utils/pathUtils");
const Products = require("../models/product");
const Users = require("../models/user");
const { slugify } = require("../utils/slugify");
const { title } = require("process");

exports.getProducts = (req, res, next) => {
  Products.find().then((products) => {
   res.render("store/products", { 
    title: "Products", 
    products: products,
    isLoggedIn: req.isLoggedIn,
    user : req.user
  });
  });
};

exports.getDeals = (req, res, next) => {
  res.render("store/deals", { 
    title: "Hot Deals",
    isLoggedIn: req.isLoggedIn,
    user : req.user
  });
};

exports.getCategories = (req, res, next) => {
  res.render("store/categories", { 
    title: "Categories", 
    isLoggedIn: req.isLoggedIn,
    user : req.user
  });
};

exports.getCategory = (req, res, next) => {
  const category = slugify(req.params.category);

  Products.find()
    .then((products) => {
      const filteredProducts = products.filter(
        (product) => slugify(product.category) === category
      );

      res.render("store/products", {
        title: category.toUpperCase(),
        products: filteredProducts,
        isLoggedIn: req.isLoggedIn,
        user: req.user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server Error");
    });
};

exports.getNewArrivals = (req, res, next) => {
   Products.find()
      .then((products) => {
        const filteredProducts = products.filter(
          (product) => slugify(product.badge) === "new-arrival"
        );
  
        res.render("store/newArrivals", {
          title: "New Arrivals",
          products: filteredProducts,
          isLoggedIn: req.isLoggedIn,
          user: req.user,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Server Error");
      });
};

exports.getPrivacyPolicy = (req, res, next) => {
  res.render("store/privacyPolicy", { title: "Privacy & Policy", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

exports.getTerms = (req, res, next) => {
  res.render("store/terms", { title: "Terms", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

exports.getSupport = (req, res, next) => {
  res.render("store/support", { title: "Support", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

exports.getHelpCenter = (req, res, next) => {
  res.render("store/helpCenter", { title: "Help Center", isLoggedIn: req.isLoggedIn,
      user: req.user,});
};

exports.getDetails = (req, res, next) => {
  const productId = req.params.productId;
  Products.findById(productId).then((product) => {
    if( product ) {
      res.render("store/productDetails", { product: product, title: product.title, isLoggedIn: req.isLoggedIn, user: req.user,});
    } else {
      res.status(404).sendFile(path.join(rootDir, "views", "pageNotFound.html"));
    }
  });
};