const isAuth = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  next();
};
module.exports = isAuth;