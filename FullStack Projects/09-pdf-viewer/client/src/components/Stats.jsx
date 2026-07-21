import React from 'react';
import { FileText, HardDrive, Clock } from 'lucide-react';

function Stats({ pdfs }) {
  const totalPdfs = pdfs.length;

  const totalBytes = pdfs.reduce(
    (sum, pdf) => sum + (pdf.size || 0),
    0
  );

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  const latest =
    pdfs.length > 0
      ? new Date(pdfs[0].createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
      : "No uploads";

  return (
    <div className="grid md:grid-cols-3 gap-5 mb-8">
      
      {/* Total PDFs Card */}
      <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Total PDFs
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <FileText size={18} />
          </div>
        </div>
        
        <p className="text-3xl font-bold tracking-tight text-slate-100 mt-4">
          {totalPdfs}
        </p>
      </div>

      {/* Storage Used Card */}
      <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Storage Used
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            <HardDrive size={18} />
          </div>
        </div>
        
        <p className="text-3xl font-bold tracking-tight text-slate-100 mt-4">
          {totalMB} <span className="text-base font-medium text-slate-400">MB</span>
        </p>
      </div>

      {/* Latest Upload Card */}
      <div className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Latest Upload
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Clock size={18} />
          </div>
        </div>
        
        <p className="text-lg font-bold tracking-tight text-slate-100 mt-4 truncate" title={latest}>
          {latest}
        </p>
      </div>

    </div>
  );
}

export default Stats;