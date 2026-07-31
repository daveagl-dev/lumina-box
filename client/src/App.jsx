import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MyFiles from "./components/MyFiles";
import SharedFiles from "./components/SharedFiles";
import Trash from "./components/Trash";
import Settings from "./components/Settings";
import QuickAccess from "./components/QuickAccess";
import RecentUploads from "./components/RecentUploads";
import RightPanel from "./components/RightPanel";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("My Drive");

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
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {activeView === "Shared Files" ? (
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
