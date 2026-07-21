import { useEffect, useState } from "react";
import { Plus, Sparkles, LayoutGrid } from "lucide-react";

import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import PdfCard from "../components/PdfCard";
import Stats from "../components/Stats";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";

import API from "../services/api";

function Home() {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const fetchPdfs = async () => {
    try {
      const res = await API.get("/pdf");
      setPdfs(res.data.pdfs || []);
    } catch (err) {
      console.error("Failed to fetch PDFs", err);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const deletePdf = async (id) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await API.delete(`/pdf/${id}`);
      fetchPdfs();
    } catch (err) {
      console.error("Failed to delete PDF", err);
    }
  };

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-250 h-100 bg-linear-to-b from-blue-600/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Dashboard Analytics Bar */}
        <Stats pdfs={pdfs} />

        {/* Action Header & Upload Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>Library Collection</span>
              <Sparkles size={18} className="text-blue-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage, preview, and organize your uploaded documents.
            </p>
          </div>

          <button
            onClick={() => setShowUpload((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
          >
            <Plus size={18} className={`transition-transform duration-300 ${showUpload ? "rotate-45" : ""}`} />
            <span>{showUpload ? "Close Upload" : "Upload PDF"}</span>
          </button>
        </div>

        {/* Collapsible Upload Form */}
        {showUpload && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <UploadForm
              onUploadSuccess={() => {
                fetchPdfs();
                setShowUpload(false);
              }}
            />
          </div>
        )}

        {/* Search Bar */}
        <SearchBar search={search} setSearch={setSearch} />

        {/* Document Grid / Empty State View */}
        {filteredPdfs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <LayoutGrid size={14} />
                <span>Showing {filteredPdfs.length} Document{filteredPdfs.length === 1 ? '' : 's'}</span>
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPdfs.map((pdf) => (
                <PdfCard key={pdf._id} pdf={pdf} onDelete={deletePdf} />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;