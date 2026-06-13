const path = require("path");
const rootDir = require("../utils/pathUtils");
const Products = require("../models/product");
const { title } = require("process");
const fs = require("fs");

exports.getAdminProducts = (req, res, next) => {
  Products.find().then((products) => {
    res.render("admin/products", {
      title: "Products List",
      products: products,
      isLoggedIn: req.isLoggedIn,
      user : req.user
    });
  }).catch((err) => {
    console.log("Error fetching products:", err);
    res.redirect("/");
  });
};

exports.getAddProducts = (req, res, next) => {
  res.render("admin/addProducts", { 
    title: "Add Products", 
    editing: false, 
    isLoggedIn: req.isLoggedIn, 
    user : req.user 
  });
};

exports.postSuccess = (req, res, next) => {
  const {
    title,
    category,
    price,
    rating,
    reviews,
    badge,
    image,
    location,
    description,
  } = req.body;
  const products = new Products({
    title,
    category,
    price,
    rating,
    reviews,
    badge,
    image,
    location,
    description,
  });
  products.save().then(() => {
    console.log("Product added successfully");
  }).catch((err) => {
    console.log("Error adding product:", err);
    res.render("admin/success", { title: "Admin | Success" });
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editing = req.query.editing === "true";
  Products.findById(productId).then((product) => {
    if (!product) {
      return res.redirect("/admin/products");
    }
    res.render("admin/addProducts", {
      productId: req.params.productId,
      editing: editing,
      product: product,
      title: "Edit Product",
      isLoggedIn: req.isLoggedIn,
      user : req.user
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {
    id,
    title,
    category,
    price,
    rating,
    reviews,
    badge,
    image,
    location,
    description,
  } = req.body;
  Products.findById(id).then((product) => {
    product.title = title;
    product.category = category;
    product.price = price;
    product.rating = rating;
    product.reviews = reviews;
    product.badge = badge;
    product.image = image;
    product.location = location;
    product.description = description;
    
    product
      .save()
      .then((result) => {
        console.log("Product updated successfully", result);
      })
      .catch((err) => console.log("Error updating product:", err));
    res.redirect("/admin/products");
  }).catch((err) => {
    console.log("Error fetching product:", err);
    res.redirect("/admin/products");
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Products.findByIdAndDelete(productId).then(() => {
    res.redirect("/admin/products");
  }).catch((err) => {
    console.log("Error deleting product:", err);
    res.redirect("/admin/products");
  });
};