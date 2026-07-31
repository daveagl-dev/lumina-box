import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MyFiles from "./components/MyFiles";
import QuickAccess from "./components/QuickAccess";
import RecentUploads from "./components/RecentUploads";
import RightPanel from "./components/RightPanel";

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#eef0f4]">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <Header />
        <MyFiles />
        <QuickAccess />
        <RecentUploads />
      </main>

      <RightPanel />
    </div>
  );
}

export default App;
