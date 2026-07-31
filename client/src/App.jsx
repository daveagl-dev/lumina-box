import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MyFiles from "./components/MyFiles";
import Gallery from "./components/Gallery";
import SharedFiles from "./components/SharedFiles";
import Trash from "./components/Trash";
import Settings from "./components/Settings";
import QuickAccess from "./components/QuickAccess";
import RecentUploads from "./components/RecentUploads";
import RightPanel from "./components/RightPanel";
import { uploadFile } from "./lib/api";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("My Drive");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const handleUploadFile = async (file) => {
    setUploadStatus({ type: "loading", message: `Uploading ${file.name}...` });
    try {
      await uploadFile(file);
      setUploadStatus({ type: "success", message: `${file.name} uploaded successfully` });
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      setUploadStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#eef0f4] lg:flex-row">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onSelectView={(label) => {
          setActiveView(label);
          setSidebarOpen(false);
        }}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onUploadFile={handleUploadFile}
          onSelectView={setActiveView}
        />
        {uploadStatus && (
          <div
            className={`rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm ${
              uploadStatus.type === "success"
                ? "bg-emerald-50 text-emerald-600"
                : uploadStatus.type === "error"
                ? "bg-rose-50 text-rose-600"
                : "bg-white text-slate-500"
            }`}
          >
            {uploadStatus.message}
          </div>
        )}
        {activeView === "Gallery" ? (
          <Gallery key={galleryRefreshKey} />
        ) : activeView === "Shared Files" ? (
          <SharedFiles />
        ) : activeView === "Trash" ? (
          <Trash />
        ) : activeView === "Settings" ? (
          <Settings />
        ) : (
          <>
            <MyFiles />
            <QuickAccess />
            <RecentUploads />
          </>
        )}
        <div className="lg:hidden">
          <RightPanel />
        </div>
      </main>

      <div className="hidden lg:block">
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
