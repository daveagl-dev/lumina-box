import { Folder } from "lucide-react";

const folders = [
  {
    name: "Q3 Project",
    files: 48,
    modified: "2 days ago",
    barColor: "bg-rose-400",
    iconBg: "bg-rose-50 text-rose-500",
  },
  {
    name: "Vacation Photos",
    files: 126,
    modified: "1 week ago",
    barColor: "bg-emerald-400",
    iconBg: "bg-emerald-50 text-emerald-500",
  },
  {
    name: "Invoices 2026",
    files: 32,
    modified: "Yesterday",
    barColor: "bg-blue-500",
    iconBg: "bg-blue-50 text-blue-500",
  },
];

export default function MyFiles() {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-800">
        My Files
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {folders.map((f) => (
          <div
            key={f.name}
            className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${f.iconBg}`}>
              <Folder size={18} />
            </div>
            <p className="mb-1 font-medium text-slate-800">{f.name}</p>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{f.files} files</span>
              <span>{f.modified}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
