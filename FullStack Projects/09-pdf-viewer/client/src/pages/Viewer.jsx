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
  Columns,
  BookOpen,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Layout View Modes: 'fit-page' | 'fit-width' | 'two-page' | 'flip'
  const [viewMode, setViewMode] = useState("fit-page");
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");

  // Viewport Container Bounds
  const [viewportBounds, setViewportBounds] = useState({ width: 0, height: 0 });

  // Touch Swipe Gesture State
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const mainContainerRef = useRef(null);
  const pageContainerRef = useRef(null);

  useEffect(() => {
    fetchPdf();
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
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

  // Auto-fallback from two-page view on small viewports
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && viewMode === "two-page") {
        setViewMode("fit-page");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  // Observe Main Viewport dimensions dynamically with defensive padding
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const isMobile = window.innerWidth < 640;
        const paddingX = isMobile ? 16 : 48;
        const paddingY = isMobile ? 16 : 48;
        
        const availableWidth = entry.contentRect.width - paddingX;
        const availableHeight = entry.contentRect.height - paddingY;
        
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
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        handlePrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages, viewMode]);

  const changePageWithAnimation = (newPage, direction) => {
    if (viewMode === "flip") {
      setFlipDirection(direction);
      setIsFlipping(true);
      setTimeout(() => {
        setPageNumber(newPage);
        setTimeout(() => setIsFlipping(false), 200);
      }, 150);
    } else {
      setPageNumber(newPage);
    }
  };

  const handleNextPage = () => {
    const step = viewMode === "two-page" ? 2 : 1;
    if (pageNumber < numPages) {
      const target = Math.min(pageNumber + step, numPages);
      changePageWithAnimation(target, "next");
    }
  };

  const handlePrevPage = () => {
    const step = viewMode === "two-page" ? 2 : 1;
    if (pageNumber > 1) {
      const target = Math.max(pageNumber - step, 1);
      changePageWithAnimation(target, "prev");
    }
  };

  // Touch Gesture Handling for Mobile Swipe Page Turn / Flip
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 40;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      handleNextPage();
    } else if (distance < -minSwipeDistance) {
      handlePrevPage();
    }
  };

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
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100 p-4">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-2xl">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span className="text-sm font-medium text-slate-300">Loading document...</span>
        </div>
      </div>
    );
  }

  // Prevent PDF elements from exceeding container dimensions
  const getRenderDimensions = () => {
    const { width, height } = viewportBounds;
    if (!width || !height) return {};

    switch (viewMode) {
      case "fit-page":
      case "flip":
        return { height: height * scale };

      case "fit-width":
        return { width: width * scale };

      case "two-page":
        return { width: ((width / 2) - 12) * scale };

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
      {/* Header Controls */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md shrink-0 z-30 shadow-md">
        
        {/* Left Section */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/50 shrink-0"
            title={isSidebarOpen ? "Hide Thumbnails" : "Show Thumbnails"}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          {!isFullscreen && (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors p-2 sm:py-1.5 sm:px-2.5 rounded-xl hover:bg-slate-800/80 shrink-0"
              title="Return to library"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-xs font-semibold">Back</span>
            </Link>
          )}

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden xs:flex p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <FileText size={16} />
            </div>
            <h1 className="text-xs sm:text-sm font-bold truncate text-slate-200" title={pdf.title}>
              {pdf.title}
            </h1>
          </div>
        </div>

        {/* Center: Page Navigation */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            disabled={pageNumber <= 1}
            onClick={handlePrevPage}
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
            onClick={handleNextPage}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-20 transition-colors"
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* View Modes */}
          <div className="flex items-center gap-0.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => { setViewMode("fit-page"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "fit-page" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="Fit Screen Mode"
            >
              <Monitor size={15} />
              <span className="hidden lg:inline">Screen</span>
            </button>

            <button
              onClick={() => { setViewMode("fit-width"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "fit-width" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="Fit Width / Scrollable"
            >
              <Maximize2 size={15} />
              <span className="hidden lg:inline">Width</span>
            </button>

            {/* Flip Mode */}
            <button
              onClick={() => { setViewMode("flip"); setScale(1.0); }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "flip" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="Page Flip Mode"
            >
              <BookOpen size={15} />
              <span className="hidden lg:inline">Flip</span>
            </button>

            <button
              onClick={() => { setViewMode("two-page"); setScale(1.0); }}
              className={`hidden sm:flex p-1.5 rounded-lg text-xs font-semibold transition-all items-center gap-1 ${
                viewMode === "two-page" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
              title="2-Up Dual Page"
            >
              <Columns size={15} />
              <span className="hidden lg:inline">2-Up</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden xs:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <button
              onClick={() => setScale(1.0)}
              className="px-1 text-xs font-semibold text-slate-400 hover:text-slate-100 transition-colors min-w-[2.5rem] text-center"
              title="Reset Zoom"
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

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 transition-opacity"
          />
        )}

        {/* Sidebar Drawer */}
        <aside 
          className={`fixed md:relative inset-y-0 left-0 bg-slate-900/95 md:bg-slate-900/70 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-40 shrink-0 ${
            isSidebarOpen 
              ? "w-64 sm:w-60 translate-x-0 opacity-100" 
              : "-translate-x-full md:translate-x-0 md:w-0 opacity-0 pointer-events-none border-none"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pages ({numPages || 0})
            </span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24 sm:pb-8 scrollbar-thin scrollbar-thumb-slate-800">
            <Document
              file={pdf.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="p-4 text-center text-xs text-slate-500">Loading thumbnails...</div>}
            >
              {Array.from(new Array(numPages || 0), (_, index) => {
                const pageIdx = index + 1;
                const isActive = pageNumber === pageIdx || (viewMode === "two-page" && pageNumber + 1 === pageIdx);
                return (
                  <div
                    key={`thumb_${pageIdx}`}
                    onClick={() => {
                      changePageWithAnimation(pageIdx, pageIdx > pageNumber ? "next" : "prev");
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all duration-150 border ${
                      isActive 
                        ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30" 
                        : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="overflow-hidden rounded-md shadow-sm pointer-events-none">
                      <Page
                        pageNumber={pageIdx}
                        width={140}
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

        {/* Viewport Canvas (Strict Size Containment) */}
        <main 
          ref={pageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 h-full w-full p-2 sm:p-4 bg-slate-950/90 overflow-y-auto overflow-x-hidden flex justify-center items-center"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-full max-h-full my-auto">
            <Document
              file={pdf.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <span className="text-xs font-medium">Rendering view...</span>
                </div>
              }
              className="flex items-center justify-center gap-3 sm:gap-4 max-w-full max-h-full"
            >
              {/* Primary Rendered Page */}
              <div 
                className={`max-w-full max-h-full shadow-2xl rounded-xl sm:rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden shrink flex items-center justify-center transition-all duration-300 transform-gpu ${
                  viewMode === "flip" ? "perspective-1000" : ""
                } ${
                  isFlipping 
                    ? flipDirection === "next" 
                      ? "-rotate-y-90 opacity-40 scale-95" 
                      : "rotate-y-90 opacity-40 scale-95" 
                    : "rotate-y-0 opacity-100 scale-100"
                }`}
              >
                <Page
                  pageNumber={pageNumber}
                  {...renderProps}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="rounded-lg sm:rounded-xl overflow-hidden max-w-[92vw] sm:max-w-full max-h-[80vh]"
                />
              </div>

              {/* Second Page (Dual Page Mode) */}
              {viewMode === "two-page" && pageNumber + 1 <= (numPages || 0) && (
                <div className="max-w-full max-h-full shadow-2xl rounded-xl sm:rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden shrink flex items-center justify-center">
                  <Page
                    pageNumber={pageNumber + 1}
                    {...renderProps}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="rounded-lg sm:rounded-xl overflow-hidden max-w-[45vw] max-h-[80vh]"
                  />
                </div>
              )}
            </Document>
          </div>
        </main>
      </div>

      {/* Mobile Floating Bottom Controls */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-md z-30 shrink-0">
        <button
          disabled={pageNumber <= 1}
          onClick={handlePrevPage}
          className="p-2 rounded-xl bg-slate-800/80 text-slate-300 disabled:opacity-20 transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            Page {pageNumber} of {numPages || "—"}
          </span>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setScale(1.0)}
              className="px-1 text-[11px] font-semibold text-slate-400"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={() => setScale((s) => Math.min(s + 0.2, 2.0))}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        <button
          disabled={pageNumber >= numPages}
          onClick={handleNextPage}
          className="p-2 rounded-xl bg-slate-800/80 text-slate-300 disabled:opacity-20 transition-colors active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default Viewer;
