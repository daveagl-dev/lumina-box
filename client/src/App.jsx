import { useEffect, useState } from "react";
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
import Login from "./components/Login";
import { uploadFile } from "./lib/api";
import { getMe, getToken, logout } from "./lib/auth";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("My Drive");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      getMe().then((user) => {
        if (user) setCurrentUser(user);
        else {
          logout();
          setIsAuthenticated(false);
        }
      });
    }
  }, [isAuthenticated, currentUser]);

  const handleUploadFile = async (file) => {
    setUploadStatus({ type: "loading", name: file.name, file, size: file.size });
    try {
      await uploadFile(file);
      setUploadStatus({ type: "success", name: file.name, file, size: file.size });
      setGalleryRefreshKey((k) => k + 1);
    } catch (err) {
      setUploadStatus({ type: "error", message: err.message });
    }
  };

  if (!isAuthenticated) {
    return (
      <Login
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
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

      <main className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 md:gap-5 md:px-6 md:py-5">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onUploadFile={handleUploadFile}
          onSelectView={setActiveView}
          avatarUrl={currentUser?.avatarUrl}
          onLogout={handleLogout}
          userName={currentUser?.name}
        />
        {activeView === "Gallery" ? (
          <Gallery key={galleryRefreshKey} />
        ) : activeView === "Shared Files" ? (
          <SharedFiles />
        ) : activeView === "Trash" ? (
          <Trash />
        ) : activeView === "Settings" ? (
          <Settings currentUser={currentUser} onUserUpdated={setCurrentUser} />
        ) : (
          <>
            <MyFiles onFolderOpen={setIsFolderOpen} />
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isFolderOpen ? "max-h-0 opacity-0" : "max-h-full opacity-100"
              }`}
            >
              <QuickAccess />
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isFolderOpen ? "max-h-0 opacity-0" : "max-h-full opacity-100"
              }`}
            >
              <RecentUploads />
            </div>
          </>
        )}
        <div className="lg:hidden">
          <RightPanel uploadStatus={uploadStatus} />
        </div>
      </main>

      <div className="hidden lg:block">
        <RightPanel uploadStatus={uploadStatus} />
      </div>
    </div>
  );
}

export default App;
