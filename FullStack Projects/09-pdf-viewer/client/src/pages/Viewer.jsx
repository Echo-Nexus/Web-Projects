import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Loader2,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Monitor,
  Maximize2,
  Columns
} from "lucide-react";
import API from "../services/api";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = 
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Viewer() {
  const { id } = useParams();

  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Layout View Modes: 'fit-page' | 'fit-width' | 'fit-height' | 'two-page'
  const [viewMode, setViewMode] = useState("fit-page");

  // Viewport Container Bounds
  const [viewportBounds, setViewportBounds] = useState({ width: 0, height: 0 });

  const mainContainerRef = useRef(null);
  const pageContainerRef = useRef(null);

  useEffect(() => {
    fetchPdf();
  }, [id]);

  async function fetchPdf() {
    try {
      const res = await API.get(`/pdf/${id}`);
      setPdf(res.data.pdf);
    } catch (err) {
      console.error("Error fetching PDF:", err);
    }
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Observe Main Viewport dimensions dynamically
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Subtract padding offsets (32px padding all around)
        const availableWidth = entry.contentRect.width - 32;
        const availableHeight = entry.contentRect.height - 32;
        
        setViewportBounds({
          width: Math.max(availableWidth, 200),
          height: Math.max(availableHeight, 200)
        });
      }
    });

    resizeObserver.observe(pageContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [isSidebarOpen]);

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = viewMode === "two-page" ? 2 : 1;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (pageNumber < numPages) setPageNumber((p) => Math.min(p + step, numPages));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (pageNumber > 1) setPageNumber((p) => Math.max(p - step, 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages, viewMode]);

  const toggleFullscreen = async () => {
    if (!mainContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await mainContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  if (!pdf) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-2xl">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span className="text-sm font-medium text-slate-300">Loading document...</span>
        </div>
      </div>
    );
  }

  // Calculate target page dimensions based on View Mode
  const getRenderDimensions = () => {
    const { width, height } = viewportBounds;
    if (!width || !height) return {};

    switch (viewMode) {
      case "fit-page":
        return { height: height * scale };

      case "fit-height":
        return { height: height * scale };

      case "fit-width":
        return { width: width * scale };

      case "two-page":
        return { width: (width / 2 - 16) * scale };

      default:
        return { height: height * scale };
    }
  };

  const renderProps = getRenderDimensions();

  return (
    <div 
      ref={mainContainerRef} 
      className={`flex flex-col h-screen overflow-hidden select-none bg-slate-950 text-slate-100 ${
        isFullscreen ? "w-screen h-screen z-50 fixed inset-0" : ""
      }`}
    >
      {/* Dynamic Header Controls */}
      <header className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md shrink-0 z-30 shadow-md">
        
        {/* Left: Sidebar Toggle, Back Button & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
            title={isSidebarOpen ? "Hide Thumbnails" : "Show Thumbnails"}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          {!isFullscreen && (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors py-1.5 px-2.5 rounded-xl hover:bg-slate-800/80 shrink-0"
              title="Return to library"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-xs font-semibold">Back</span>
            </Link>
          )}

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <FileText size={16} />
            </div>
            <h1 className="text-sm font-bold truncate text-slate-200" title={pdf.title}>
              {pdf.title}
            </h1>
          </div>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(p - (viewMode === "two-page" ? 2 : 1), 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-20 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-xs font-semibold tracking-wide px-2 text-slate-300">
            {pageNumber} {viewMode === "two-page" && pageNumber < numPages ? `- ${pageNumber + 1}` : ""} 
            <span className="text-slate-600 mx-1">/</span> {numPages || "—"}
          </span>

          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => Math.min(p + (viewMode === "two-page" ? 2 : 1), numPages))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-20 transition-colors"
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right: Predefined View Modes & Zoom */}
        <div className="flex items-center gap-2">
          
          {/* Predefined Layout Selector */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => { setViewMode("fit-page"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "fit-page" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="Fit Full Screen (Fits in 100vh)"
            >
              <Monitor size={15} />
              <span className="hidden md:inline">Fit Screen</span>
            </button>

            <button
              onClick={() => { setViewMode("fit-width"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "fit-width" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="Fit Page Width"
            >
              <Maximize2 size={15} />
              <span className="hidden md:inline">Width</span>
            </button>

            <button
              onClick={() => { setViewMode("two-page"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "two-page" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="2-Up Dual Page View"
            >
              <Columns size={15} />
              <span className="hidden md:inline">2-Up</span>
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <button
              onClick={() => setScale(1.0)}
              className="px-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors min-w-[2.8rem] text-center"
              title="Reset Zoom Scale"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 rounded-xl text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </header>

      {/* Main Workspace (Split View) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Thumbnails */}
        <aside 
          className={`bg-slate-900/70 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-20 shrink-0 ${
            isSidebarOpen ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none border-none"
          }`}
        >
          <div className="px-4 py-2.5 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pages ({numPages || 0})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            <Document
              file={pdf.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="p-4 text-center text-xs text-slate-500">Loading sidebar...</div>}
            >
              {Array.from(new Array(numPages || 0), (_, index) => {
                const pageIdx = index + 1;
                const isActive = pageNumber === pageIdx || (viewMode === "two-page" && pageNumber + 1 === pageIdx);
                return (
                  <div
                    key={`thumb_${pageIdx}`}
                    onClick={() => setPageNumber(pageIdx)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all duration-150 border ${
                      isActive 
                        ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30" 
                        : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="overflow-hidden rounded-md shadow-sm pointer-events-none">
                      <Page
                        pageNumber={pageIdx}
                        width={160}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                      Page {pageIdx}
                    </span>
                  </div>
                );
              })}
            </Document>
          </div>
        </aside>

        {/* Viewport Canvas */}
        <main 
          ref={pageContainerRef} 
          className={`flex-1 h-full w-full p-4 bg-slate-950/90 ${
            viewMode === "fit-width" 
              ? "overflow-y-auto flex justify-center items-start" 
              : "overflow-hidden flex items-center justify-center"
          }`}
        >
          <div className="flex items-center justify-center gap-4 max-w-full">
            <Document
              file={pdf.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <span className="text-xs font-medium">Rendering view...</span>
                </div>
              }
              className="flex items-center justify-center gap-4 max-w-full"
            >
              {/* Primary View Page */}
              <div className="shadow-2xl rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden shrink-0 flex items-center justify-center">
                <Page
                  pageNumber={pageNumber}
                  {...renderProps}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="rounded-xl overflow-hidden"
                />
              </div>

              {/* Second Page (Rendered in 2-Up View) */}
              {viewMode === "two-page" && pageNumber + 1 <= (numPages || 0) && (
                <div className="shadow-2xl rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden shrink-0 flex items-center justify-center">
                  <Page
                    pageNumber={pageNumber + 1}
                    {...renderProps}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="rounded-xl overflow-hidden"
                  />
                </div>
              )}
            </Document>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Viewer;