import React from 'react';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <span className="text-xl">📚</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
            Digital PDF <span className="text-blue-500 font-bold">Library</span>
          </h1>
        </div>

        {/* Tech Stack Badges */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            Cloudinary
          </span>
          <span className="text-slate-600">•</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            MongoDB
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;