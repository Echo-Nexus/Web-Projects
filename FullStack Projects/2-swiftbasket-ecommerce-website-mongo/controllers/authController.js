const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { MongoErrorLabel } = require("mongodb");

exports.signupValidation = [
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First Name should be at least 3 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastName")
    .trim()
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Must contain uppercase")
    .matches(/[a-z]/)
    .withMessage("Must contain lowercase")
    .matches(/\d/)
    .withMessage("Must contain number")
    .matches(/[@$*#!]/)
    .withMessage("Must contain special character"),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),

  check("accountType")
    .notEmpty()
    .withMessage("Please select account type")
    .isIn(["Admin", "Guest"]),

  check("terms")
    .custom((value) => value === "accepted")
    .withMessage("Please accept terms"),
];

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    isLoggedIn: req.isLoggedIn,
    errors: [],
    oldInput: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      errors: ["User does not exist !"],
      isLoggedIn: false,
      oldInput: { email },
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(422).render("auth/login", {
      errors: ["Password is incorrect !"],
      isLoggedIn: false,
      oldInput: { email },
    });
  }
  try {
    req.session.isLoggedIn = true;
    req.session.userId = user._id.toString();
    await req.session.save();
    console.log("Session saved successfully");
    return res.redirect("/");
  } catch (err) {
    console.log("SESSION ERROR:", err);
    return next(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    isLoggedIn: req.isLoggedIn,
    errors: [],
    oldInput: {},
  });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { firstName, lastName, email, accountType } = req.body;
    return res.status(422).render("auth/signup", {
      errors: errors.array().map((err) => err.msg),
      oldInput: { firstName, lastName, email, accountType },
      isLoggedIn: req.isLoggedIn,
    });
  }

  const { firstName, lastName, email, password, accountType } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        firstName: firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
      });
      return user.save();
    })
    .then(() => {
      return res.redirect("/auth/login");
    })
    .catch((err) => {
      return res.status(422).render("auth/signup", {
        errors: [err.message],
        oldInput: { firstName, lastName, email, accountType },
        isLoggedIn: req.isLoggedIn,
      });
    });
};

exports.getNotAuthorized = (req, res, next) => {
  res.render("auth/notAuthorized", {
    isLoggedIn: req.isLoggedIn,
    errors: [],
    oldInput: {},
  });
};