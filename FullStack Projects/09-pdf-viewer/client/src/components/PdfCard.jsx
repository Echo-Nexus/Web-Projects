import React from 'react';
import { Eye, Download, Trash2, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

function PdfCard({ pdf, onDelete }) {
  return (
    <div className="group relative flex flex-col justify-between bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
      
      {/* Top Header & Info */}
      <div>
        <div className="flex items-start gap-3.5">
          {/* File Icon Badge */}
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <FileText size={22} />
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors" title={pdf.title}>
              {pdf.title}
            </h2>
            
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <Calendar size={13} className="text-slate-500" />
              <span>{new Date(pdf.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
        
        {/* View Action (Primary) */}
        <Link
          to={`/pdf/${pdf._id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]"
        >
          <Eye size={15} />
          <span>View</span>
        </Link>

        {/* Download Action (Secondary) */}
        <a
          href={pdf.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700/60 transition-all duration-200 active:scale-[0.98]"
          title="Download PDF"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Download</span>
        </a>

        {/* Delete Action (Destructive Icon Button) */}
        <button
          onClick={() => onDelete(pdf._id)}
          className="flex items-center justify-center p-2.5 text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all duration-200 active:scale-[0.98]"
          title="Delete PDF"
        >
          <Trash2 size={15} />
        </button>

      </div>

    </div>
  );
}

export default PdfCard;