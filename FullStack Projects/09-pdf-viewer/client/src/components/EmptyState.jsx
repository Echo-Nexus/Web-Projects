import React from 'react';

function EmptyState() {
  return (
    <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center backdrop-blur-md max-w-md mx-auto my-8">
      {/* Soft Glow Ambient Background */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Animated Icon Badge */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 mb-5 shadow-inner group transition-transform duration-300 hover:scale-105">
        <span className="text-3xl filter drop-shadow">📂</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold tracking-tight text-slate-100 mb-2">
        No PDFs Found
      </h3>

      <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
        Upload a PDF to get started, or try tweaking your search filters.
      </p>
    </div>
  );
}

export default EmptyState;