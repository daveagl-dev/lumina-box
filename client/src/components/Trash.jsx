import { useState } from "react";
import { FileText, Image, Folder, RotateCcw, Trash2 } from "lucide-react";

const initialRows = [
  {
    name: "Old Invoices",
    size: "4.1 MB",
    format: "Folder",
    deleted: "2 days ago",
    icon: Folder,
    color: "text-amber-500 bg-amber-50",
  },
  {
    name: "Draft Proposal",
    size: "812 KB",
    format: "PDF file",
    deleted: "5 days ago",
    icon: FileText,
    color: "text-rose-500 bg-rose-50",
  },
  {
    name: "Team Photo",
    size: "3.6 MB",
    format: "JPG file",
    deleted: "1 week ago",
    icon: Image,
    color: "text-purple-500 bg-purple-50",
  },
];

export default function Trash() {
  const [rows, setRows] = useState(initialRows);

  const handleRestore = (name) => {
    setRows(rows.filter((r) => r.name !== name));
  };

  const handleDeleteForever = (name) => {
    setRows(rows.filter((r) => r.name !== name));
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:min-h-0 lg:flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Trash</h2>
        {rows.length > 0 && (
          <button
            onClick={() => setRows([])}
            className="text-xs font-medium text-coral"
          >
            Empty trash
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
          <Trash2 size={28} />
          <p className="text-sm">Trash is empty</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {rows.map(({ name, size, format, deleted, icon: Icon, color }) => (
              <div key={name} className="flex items-start justify-between rounded-lg bg-slate-50 p-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{format} • {deleted}</p>
                  </div>
                </div>
                <div className="flex shrink-0 ml-2 gap-1">
                  <button
                    onClick={() => handleRestore(name)}
                    title="Restore"
                    className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-emerald-500"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteForever(name)}
                    title="Delete forever"
                    className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-400">
                  <th className="pb-3 font-normal">Name</th>
                  <th className="pb-3 font-normal">Size</th>
                  <th className="pb-3 font-normal">File Format</th>
                  <th className="pb-3 font-normal">Deleted</th>
                  <th className="pb-3 font-normal" />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ name, size, format, deleted, icon: Icon, color }) => (
                  <tr key={name} className="border-t border-slate-100">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <p className="font-medium text-slate-800">{name}</p>
                      </div>
                    </td>
                    <td className="text-slate-500">{size}</td>
                    <td className="text-slate-500">{format}</td>
                    <td className="text-slate-500">{deleted}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRestore(name)}
                          title="Restore"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-emerald-500"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteForever(name)}
                          title="Delete forever"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
