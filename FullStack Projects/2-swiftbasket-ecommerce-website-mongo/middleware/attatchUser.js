const User = require("../models/user");
module.exports = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(req.session.userId);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};