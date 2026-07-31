import { useRef } from "react";
import { Search, Bell, Grid2x2, Upload, Image, Clock, Trash2, Menu } from "lucide-react";

const quickAccess = [
  { name: "Gallery", view: "Gallery", icon: <Image size={16} />, color: "text-blue-500 bg-blue-50" },
  { name: "Recent", view: null, icon: <Clock size={16} />, color: "text-emerald-500 bg-emerald-50" },
  { name: "Trash", view: "Trash", icon: <Trash2 size={16} />, color: "text-rose-500 bg-rose-50" },
];

export default function Header({ onMenuClick, onUploadFile, onSelectView }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onUploadFile?.(file);
    event.target.value = "";
  };

  return (
    <header className="mb-4 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3">
        <button
          onClick={onMenuClick}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">
            Welcome, David!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            It's a good day to be organized, innit?
          </p>
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleUploadClick}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-coral to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:shadow-md hover:shadow-orange-300 active:scale-[0.98] sm:text-base"
            >
              <Upload size={18} />
              <span>Upload file</span>
            </button>
            {quickAccess.map((q) => (
              <button
                key={q.name}
                onClick={() => q.view && onSelectView?.(q.view)}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 sm:text-sm"
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${q.color}`}>
                  {q.icon}
                </span>
                <span className="hidden sm:inline">{q.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm lg:flex-none">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Search file"
            className="w-full min-w-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none lg:w-64"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
            <Bell size={18} />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm sm:flex">
            <Grid2x2 size={18} />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Raafi G."
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-slate-700">Raafi G.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
