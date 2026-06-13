const allowRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (!roles.includes(user.accountType)) {
      return res.redirect("/auth/notAuthorized");
    }

    next();
  };
};
module.exports = allowRoles;