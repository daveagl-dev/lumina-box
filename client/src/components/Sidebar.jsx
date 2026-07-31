import {
  Monitor,
  Users,
  Star,
  Clock,
  Trash2,
  Settings,
  Cloud,
} from "lucide-react";

const navItems = [
  { label: "My Drive", icon: Monitor, active: true },
  { label: "Shared Files", icon: Users },
  { label: "Favorite", icon: Star },
  { label: "Newest Files", icon: Clock },
  { label: "Trash", icon: Trash2 },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col justify-between overflow-hidden bg-navy px-5 py-5 text-white">
      <div>
        <div className="mb-8 flex items-center gap-1 px-1 text-xl font-semibold">
          Lumina Box<span className="text-coral">.</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-coral text-white shadow-lg shadow-coral/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl bg-[#242c3d] p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral/20 text-coral">
            <Cloud size={18} />
          </div>
          <div>
            <p className="text-sm font-medium">60% available storage</p>
          </div>
        </div>
        <p className="mb-3 text-xs text-slate-400">
          20 GB of 100 GB already used
        </p>
        <button className="w-full rounded-lg bg-coral py-2 text-xs font-medium text-white transition hover:bg-coral/90">
          Upgrade Storage
        </button>
      </div>
    </aside>
  );
}
