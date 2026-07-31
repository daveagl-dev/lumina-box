import { useState } from "react";
import { Folder, Plus, X, MoreHorizontal, Trash2 } from "lucide-react";

const colorOptions = [
  { name: "Rose", barColor: "bg-rose-400", iconBg: "bg-rose-50 text-rose-500" },
  { name: "Emerald", barColor: "bg-emerald-400", iconBg: "bg-emerald-50 text-emerald-500" },
  { name: "Blue", barColor: "bg-blue-500", iconBg: "bg-blue-50 text-blue-500" },
  { name: "Purple", barColor: "bg-purple-400", iconBg: "bg-purple-50 text-purple-500" },
  { name: "Amber", barColor: "bg-amber-400", iconBg: "bg-amber-50 text-amber-500" },
];

const initialFolders = [
  {
    name: "All Files",
    files: 2592,
    modified: "Just now",
    barColor: "bg-rose-400",
    iconBg: "bg-rose-50 text-rose-500",
  },
];

export default function MyFiles() {
  const [folders, setFolders] = useState(initialFolders);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorOptions[0]);
  const [openMenu, setOpenMenu] = useState(null);

  const handleCreate = () => {
    if (!name.trim()) return;
    setFolders([
      ...folders,
      {
        name: name.trim(),
        files: 0,
        modified: "Just now",
        barColor: color.barColor,
        iconBg: color.iconBg,
        custom: true,
      },
    ]);
    setName("");
    setColor(colorOptions[0]);
    setIsCreating(false);
  };

  const handleDelete = (folderName) => {
    setFolders(folders.filter((f) => f.name !== folderName));
    setOpenMenu(null);
  };

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-800">
        My Files
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {folders.map((f) => (
          <div
            key={f.name}
            className="relative cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${f.iconBg}`}>
                <Folder size={18} />
              </div>
              {f.custom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === f.name ? null : f.name);
                  }}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  <MoreHorizontal size={16} />
                </button>
              )}
            </div>
            <p className="mb-1 font-medium text-slate-800">{f.name}</p>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{f.files} files</span>
              <span>{f.modified}</span>
            </div>

            {openMenu === f.name && (
              <div className="absolute right-3 top-11 z-10 w-32 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(f.name);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsCreating(true)}
          className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-coral/40 hover:text-coral"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">New Folder</span>
        </button>
      </div>

      {isCreating && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="w-[calc(100%-2rem)] max-w-80 rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">New Folder</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color.iconBg}`}>
                <Folder size={26} />
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-slate-500">Folder name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Tax Documents"
              className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-coral"
            />

            <label className="mb-2 block text-xs font-medium text-slate-500">Icon color</label>
            <div className="mb-5 flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full ${c.barColor} ${
                    color.name === c.name ? "ring-2 ring-offset-2 ring-slate-400" : ""
                  }`}
                  aria-label={c.name}
                />
              ))}
            </div>

            <button
              onClick={handleCreate}
              className="w-full rounded-lg bg-coral py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
