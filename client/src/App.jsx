import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MyFiles from "./components/MyFiles";
import QuickAccess from "./components/QuickAccess";
import RecentUploads from "./components/RecentUploads";
import RightPanel from "./components/RightPanel";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#eef0f4] lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <MyFiles />
        <QuickAccess />
        <RecentUploads />
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
