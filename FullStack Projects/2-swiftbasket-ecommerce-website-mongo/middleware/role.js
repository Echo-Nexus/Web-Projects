const allowRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (!roles.includes(user.accountType)) {
      return res.redirect("/");
    }

    next();
  };
};
module.exports = allowRoles;