require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

/* ----------------------------- Database ----------------------------- */

connectDB();

/* ----------------------------- Middlewares ----------------------------- */

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ----------------------------- Routes ----------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Digital PDF API Running 🚀",
  });
});

/* ----------------------------- Pdf Handler ----------------------------- */
app.use("/api/pdf", pdfRoutes);

/* ----------------------------- Error Handler ----------------------------- */

app.use(errorHandler);

/* ----------------------------- Server ----------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
