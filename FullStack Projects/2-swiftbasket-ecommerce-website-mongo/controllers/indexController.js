const path = require("path");
const rootDir = path.dirname(require.main.filename);
const Products = require("../models/product");
const { slugify } = require("../utils/slugify");

exports.getHome = (req, res, next) => {
    Products.find()
      .then((products) => {
        const filteredProducts = products.filter(
          (product) => slugify(product.badge) === "trending"
        );
  
        res.render("index", {
          title: "Home",
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
