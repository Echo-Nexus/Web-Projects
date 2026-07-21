import { useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import API from "../services/api";

function UploadForm({ onUploadSuccess }) {
  const [pdf, setPdf] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  const handleUpload = async () => {
    if (!pdf) {
      return alert("Please choose a PDF first.");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("pdf", pdf);

      await API.post("/pdf/upload", formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      alert("PDF uploaded successfully!");

      setPdf(null);
      setProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-md shadow-xl">
      
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          const file = e.dataTransfer.files[0];

          if (file && file.type === "application/pdf") {
            setPdf(file);
          }
        }}
        onClick={() => inputRef.current.click()}
        className={`
          group relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${
            dragging
              ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
              : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60"
          }
        `}
      >
        {/* Upload Icon Container */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <Upload size={26} />
        </div>

        <h2 className="text-lg font-bold text-slate-100 mt-4">
          Drag & Drop your PDF here
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Upload documents securely with Cloudinary integration.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-slate-500">
          <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            PDF only
          </span>
          <span>•</span>
          <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            Max 10 MB
          </span>
        </div>

        <p className="text-xs text-blue-400 font-medium mt-3 group-hover:underline">
          or click to browse from device
        </p>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
        />
      </div>

      {/* Selected File Chip */}
      {pdf && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
              <FileText size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {pdf.name}
              </p>
              <p className="text-xs text-slate-400">
                {(pdf.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            onClick={() => setPdf(null)}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Progress Bar Container */}
      {loading && (
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Uploading...</span>
            <span className="text-blue-400">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/50"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !pdf}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading Document...</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            <span>Upload PDF</span>
          </>
        )}
      </button>

    </div>
  );
}

export default UploadForm;