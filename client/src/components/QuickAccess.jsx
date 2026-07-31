import { FileText, Music, Video, Image, ArrowUp } from "lucide-react";

const items = [
  {
    name: "Refactoring UI.pdf",
    size: "312 KB",
    icon: FileText,
    color: "text-rose-500 bg-rose-50",
  },
  {
    name: "Kataamoi.mp3",
    size: "1.5 MB",
    icon: Music,
    color: "text-purple-500 bg-purple-50",
  },
  {
    name: "Deadpool.mp4",
    size: "2.3 GB",
    icon: Video,
    color: "text-blue-500 bg-blue-50",
  },
  {
    name: "Spongebob.png",
    size: "612 KB",
    icon: Image,
    color: "text-emerald-500 bg-emerald-50",
  },
];

export default function QuickAccess() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Quick Access
        </h2>
        <button className="flex items-center gap-1 text-xs font-medium text-coral">
          Newest <ArrowUp size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map(({ name, size, icon: Icon, color }) => (
          <div key={name} className="rounded-2xl bg-white p-4 shadow-sm">
            <div
              className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}
            >
              <Icon size={18} />
            </div>
            <p className="mb-1 truncate text-sm font-medium text-slate-800">
              {name}
            </p>
            <p className="text-xs text-slate-400">{size}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
