const cloudinary = require("../config/cloudinary");
const Pdf = require("../models/Pdf");
const fs = require("fs-extra");

const uploadPdf = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "DigitalPDFUploader",
    });

    // Check if a PDF with the same title already exists
    const existingPdf = await Pdf.findOne({
      title: req.file.originalname,
    });

    if (existingPdf) {
      // Remove the uploaded file from Cloudinary
      await cloudinary.uploader.destroy(result.public_id, {
        resource_type: "raw",
      });

      // Remove temporary local file
      await fs.remove(req.file.path);

      return res.status(409).json({
        success: false,
        message: "A PDF with this title already exists.",
      });
    }

    const pdf = await Pdf.create({
      title: req.file.originalname,
      pdfUrl: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
    });

    await fs.remove(req.file.path);

    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully.",
      pdf,
    });
  } catch (err) {
    if (req.file) {
      await fs.remove(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All PDFs
const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pdfs.length,
      pdfs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(pdf.publicId, {
      resource_type: "raw",
    });

    // Delete from MongoDB
    // await Pdf.findByIdAndDelete(req.params.id);
    await pdf.deleteOne();

    res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPdfById = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    res.status(200).json({
      success: true,
      pdf,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadPdf,
  getAllPdfs,
  deletePdf,
  getPdfById,
};
