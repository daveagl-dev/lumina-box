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
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 -translate-x-full flex-col justify-between overflow-y-auto overflow-x-hidden bg-navy px-4 py-4 text-white transition-transform duration-200 sm:px-5 sm:py-5 lg:static lg:w-64 lg:translate-x-0 ${
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

          <nav className="flex flex-col gap-0.5 sm:gap-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => onSelectView(label)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm ${
                  activeView === label
                    ? "bg-coral text-white shadow-lg shadow-coral/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} className="sm:size-[18px]" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="rounded-lg bg-[#242c3d] p-3 sm:rounded-2xl sm:p-4">
          <div className="mb-2 flex items-center gap-2 sm:mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral/20 text-coral sm:h-9 sm:w-9">
              <Cloud size={16} className="sm:size-[18px]" />
            </div>
            <div>
              <p className="text-xs font-medium sm:text-sm">Want more storage?</p>
            </div>
          </div>
          <p className="mb-2 text-xs text-slate-400 sm:mb-3">
            Get 500GB at $3.99/month
          </p>
          <button className="w-full rounded-lg bg-coral py-1.5 text-xs font-medium text-white transition hover:bg-coral/90 sm:py-2">
            Upgrade Storage
          </button>
        </div>
      </aside>
    </>
  );
}
