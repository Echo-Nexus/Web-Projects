// Core Module
const path = require("path");

// External Module
const express = require("express");
const DB_PATH = "mongodb+srv://kc336115_db_user:PasserBy@fullstack-projects.xpzrnlf.mongodb.net/swiftbasket?appName=FullStack-Projects";
const{ default: mongoose } = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


// Custom Module
const rootDir = require("./utils/pathUtils");
const { storeRouter } = require("./routers/storeRouter");
const { adminRouter } = require("./routers/adminRouter");
const { authRouter } = require("./routers/authRouter");
const { userRouter } = require("./routers/userRouter");
const {pageNotFound} = require("./controllers/errController");
const { getHome } = require("./controllers/indexController");
const attchUser = require("./middleware//attatchUser");


const app = express();

// It sets ejs to work

app.set("view engine", "ejs");

// It is default value but best practice is to use it. If any case that your directory's name is not "views"

app.set("views", path.join(rootDir, "views"));

// It serves "Public" directory to browser

app.use(express.static(path.join(rootDir, "public")));

// It helps to use input data without decoding manually

app.use(express.urlencoded({ extended: true }));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store
  }),
);

// User Account Type Validator
app.use(attchUser);

app.get("/", getHome);

// This is for Auth Router

app.use("/auth", authRouter);

// This is for Admin Router

app.use("/admin", adminRouter);

// This is for Store Router

app.use("/store", storeRouter);

// This is for User Router

app.use("/user", userRouter);

// Routing for 404 Error

app.use(pageNotFound);

// It is the main server
const PORT = 3001;
mongoose.connect(DB_PATH).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
}).catch((err) => {
  console.log("Error while connecting with MongoDB", err);
});
