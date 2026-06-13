require("dotenv").config();

// Core Module
const path = require("path");

// External Module
const express = require("express");
const DB_PATH = process.env.MONGODB_URI;
const{ default: mongoose } = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");



// Custom Module
const rootDir = require("./utils/pathUtils");
const { storeRouter } = require("./routers/storeRouter");
const { adminRouter } = require("./routers/adminRouter");
const { authRouter } = require("./routers/authRouter");
const { userRouter } = require("./routers/userRouter");
const {pageNotFound} = require("./controllers/errController");
const { getHome } = require("./controllers/indexController");
const attchUser = require("./middleware/attatchUser");
const isAuth = require("./middleware/isAuth");
const allowRoles = require("./middleware/role");


const app = express();

// It sets ejs to work

app.set("view engine", "ejs");

// It is default value but best practice is to use it. If any case that your directory's name is not "views"

app.set("views", path.join(rootDir, "views"));

// It serves "Public" directory to browser

app.use(express.static(path.join(rootDir, "public")));

// It helps to use input data without decoding manually

app.use(express.urlencoded({ extended: true }));

app.enable('trust proxy');

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);
app.use(cookieParser());
app.use(attchUser);
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});
app.get("/", getHome);
app.use("/auth", authRouter);
app.use("/admin", isAuth, allowRoles("Admin"), adminRouter);
app.use("/store", isAuth, allowRoles("Guest", "Admin"), storeRouter);
app.use("/user", userRouter);
app.use(pageNotFound);

// It is the main server
const PORT = process.env.PORT || 3000;
mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
}).catch((err) => {
  console.log("Error while connecting with MongoDB", err);
});