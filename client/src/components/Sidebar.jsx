import {
  Monitor,
  Users,
  Star,
  Clock,
  Trash2,
  Settings,
  Cloud,
  Image,
  X,
} from "lucide-react";

const navItems = [
  { label: "My Drive", icon: Monitor },
  { label: "Gallery", icon: Image },
  { label: "Favorites", icon: Star },
  { label: "Newest Files", icon: Clock },
  { label: "Shared Files", icon: Users },
  { label: "Trash", icon: Trash2 },
  { label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose, activeView, onSelectView }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 -translate-x-full flex-col justify-between overflow-hidden bg-navy px-5 py-5 text-white transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between px-1">
            <button
              onClick={() => onSelectView("My Drive")}
              className="flex items-center gap-1 text-2xl font-semibold text-white"
            >
              Lumina Box<span className="text-coral">.</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => onSelectView(label)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  activeView === label
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
    </>
  );
}
