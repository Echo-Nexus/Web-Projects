exports.pageNotFound = (req, res, next) => {
  res.status(404).render("pageNotFound", {
    title: "Page Not Found",
    isLoggedIn: req.isLoggedIn,
    user: req.user,
  });
};

// This code gives the 404 Error when page link didn't match with any of the given link in the routing.