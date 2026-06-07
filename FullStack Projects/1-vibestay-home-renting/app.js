const path = require("path");
const express = require("express");
const { storeRouter } = require("./routers/storeRouter");
const { hostRouter } = require("./routers/hostRouter");
const { pageNotFound } = require("./controllers/err");
const rootDir = require("./utils/pathUtils");
const { connect_db } = require("./utils/database");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(pageNotFound);

const PORT = 3001;
connect_db(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});
