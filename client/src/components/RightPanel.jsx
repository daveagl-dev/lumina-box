import { useState } from "react";
import { FileText, Video, Image as ImageIcon, Music, MoreHorizontal, UploadCloud } from "lucide-react";
import AngelaChat from "./AngelaChat";

const details = [
  { label: "Documents", sub: "2,124 files", size: "5 GB", gb: 5, icon: FileText, color: "text-rose-500 bg-rose-50", hex: "#f43f5e" },
  { label: "Images", sub: "266 files", size: "2 GB", gb: 2, icon: ImageIcon, color: "text-emerald-500 bg-emerald-50", hex: "#10b981" },
  { label: "Videos", sub: "10 files", size: "12 GB", gb: 12, icon: Video, color: "text-blue-500 bg-blue-50", hex: "#3b82f6" },
  { label: "Audio", sub: "112 files", size: "500 MB", gb: 0.5, icon: Music, color: "text-purple-500 bg-purple-50", hex: "#a855f7" },
  { label: "Others", sub: "80 files", size: "500 MB", gb: 0.5, icon: MoreHorizontal, color: "text-amber-500 bg-amber-50", hex: "#f59e0b" },
];

const freeGb = 80;
const usedGb = details.reduce((sum, d) => sum + d.gb, 0);
const totalGb = usedGb + freeGb;
const circumference = 2 * Math.PI * 52;

export default function RightPanel() {
  let offset = 0;
  const [selected, setSelected] = useState(null);

  const centerLabel = selected ? selected.label : "used";
  const centerValue = selected ? `${selected.gb} GB` : `${usedGb} GB`;

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col gap-4 overflow-hidden bg-white py-5 pl-6 pr-8 shadow-sm">
      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-800">Storage</h2>
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#eef0f4" strokeWidth="10" />
            {details.map((detail) => {
              const { label, gb, hex } = detail;
              const fraction = gb / totalGb;
              const dash = fraction * circumference;
              const isSelected = selected?.label === label;
              const circle = (
                <circle
                  key={label}
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={hex}
                  strokeWidth={isSelected ? 13 : 10}
                  strokeOpacity={selected && !isSelected ? 0.35 : 1}
                  strokeLinecap="butt"
                  strokeDasharray={`${Math.max(dash - 2, 0)} ${circumference - dash + 2}`}
                  strokeDashoffset={-offset}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelected(isSelected ? null : detail)}
                />
              );
              offset += dash;
              return circle;
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-semibold text-slate-800">
              {centerValue}
            </span>
            <span className="text-xs text-slate-400">{centerLabel}</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          <span className="font-medium text-slate-600">{usedGb} GB</span> used of{" "}
          <span className="font-medium text-slate-600">{totalGb} GB</span> total
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-800">Details</h2>
        <div className="flex flex-col gap-3">
          {details.map((detail) => {
            const { label, sub, size, icon: Icon, color } = detail;
            const isSelected = selected?.label === label;
            return (
              <div
                key={label}
                onClick={() => setSelected(isSelected ? null : detail)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-1 py-0.5 transition ${
                  isSelected ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{size}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-coral/40 bg-coral/5 py-3 text-coral transition hover:bg-coral/10">
        <UploadCloud size={18} />
        <span className="text-sm font-medium">Upload Files</span>
      </button>

      <AngelaChat />
    </aside>
  );
}
