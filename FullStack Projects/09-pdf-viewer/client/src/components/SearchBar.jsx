import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ search, setSearch }) {
  const inputRef = useRef(null);

  // Focus search input when pressing '/' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <div className="group relative flex items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl shadow-slate-950/20 backdrop-blur-md transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-slate-700/80">
        
        {/* Left Search Icon */}
        <div className="pl-4 text-slate-400 group-focus-within:text-blue-400 transition-colors">
          <Search size={18} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search PDFs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        {/* Right Section: Clear Button OR Keyboard Shortcut Hint */}
        <div className="pr-3.5 flex items-center gap-2">
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-700/80 transition-all"
              title="Clear search"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-800/50 border border-slate-700/50 rounded-md">
              /
            </kbd>
          )}
        </div>

      </div>
    </div>
  );
}

export default SearchBar;