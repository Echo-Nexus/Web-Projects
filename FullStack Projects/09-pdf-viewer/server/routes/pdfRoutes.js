const express = require("express");
const upload = require("../config/multer");
const router = express.Router();

const {
  uploadPdf,
  getAllPdfs,
  deletePdf,
  getPdfById,
} = require("../controllers/pdfController");

// Get route
router.get("/", getAllPdfs);
// Get pdfs by id only
router.get("/:id", getPdfById);

// Upload one PDF
router.post("/upload", upload.single("pdf"), uploadPdf);

// Delets the pdf file from database and cloudinary
router.delete("/:id", deletePdf);

module.exports = router;
