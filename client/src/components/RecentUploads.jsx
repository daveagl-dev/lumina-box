import { FileText, Video, MoreHorizontal } from "lucide-react";

const rows = [
  {
    name: "Refactoring UI",
    owner: "Clementine Namberry",
    size: "312 KB",
    format: "PDF file",
    modified: "5 minutes ago",
    icon: FileText,
    color: "text-rose-500 bg-rose-50",
  },
  {
    name: "Deadpool",
    owner: "Felice Paquet",
    size: "2.3 GB",
    format: "MP4 file",
    modified: "45 minutes ago",
    icon: Video,
    color: "text-blue-500 bg-blue-50",
  },
];

export default function RecentUploads() {
  return (
    <section className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Files Uploaded Recently
        </h2>
        <button className="text-xs font-medium text-coral">See all</button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-slate-400">
            <th className="pb-3 font-normal">Name</th>
            <th className="pb-3 font-normal">Size</th>
            <th className="pb-3 font-normal">File Format</th>
            <th className="pb-3 font-normal">Last Modified</th>
            <th className="pb-3 font-normal" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, owner, size, format, modified, icon: Icon, color }) => (
            <tr key={name} className="border-t border-slate-100">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{owner}</p>
                  </div>
                </div>
              </td>
              <td className="text-slate-500">{size}</td>
              <td className="text-slate-500">{format}</td>
              <td className="text-slate-500">{modified}</td>
              <td>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
