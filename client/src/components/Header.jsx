import { Search, Bell, Grid2x2, Star, Users, Clock, Trash2 } from "lucide-react";

const quickAccess = [
  { name: "Favorites", icon: <Star size={16} />, color: "text-amber-500 bg-amber-50" },
  { name: "Shared with me", icon: <Users size={16} />, color: "text-blue-500 bg-blue-50" },
  { name: "Recent", icon: <Clock size={16} />, color: "text-emerald-500 bg-emerald-50" },
  { name: "Trash", icon: <Trash2 size={16} />, color: "text-rose-500 bg-rose-50" },
];

export default function Header() {
  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome, David!
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          It's a good day to be organized, innit?
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {quickAccess.map((q) => (
            <button
              key={q.name}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-md ${q.color}`}>
                {q.icon}
              </span>
              {q.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search file"
          className="w-64 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <Bell size={18} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
          <Grid2x2 size={18} />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Raafi G."
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-slate-700">Raafi G.</span>
        </div>
      </div>
    </header>
  );
}
