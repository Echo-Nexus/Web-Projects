const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pdf", pdfSchema);