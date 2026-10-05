import { useState } from "react";
import {
  FileText,
  Image,
  FileSpreadsheet,
  Folder,
  Star,
} from "lucide-react";
import { useLanguage } from "../lib/i18n";

const initialRows = [
  {
    name: "Q3 Marketing Plan",
    size: "1.4 MB",
    ext: "PDF",
    modified: "ago_2hours",
    icon: FileText,
    color: "text-rose-500 bg-rose-50",
  },
  {
    name: "Brand Assets",
    size: "18.2 MB",
    ext: "ZIP",
    modified: "ago_yesterday",
    icon: Folder,
    color: "text-amber-500 bg-amber-50",
  },
  {
    name: "Team Photo",
    size: "3.1 MB",
    ext: "JPG",
    modified: "ago_2days",
    icon: Image,
    color: "text-purple-500 bg-purple-50",
  },
  {
    name: "Budget Overview",
    size: "620 KB",
    ext: "XLSX",
    modified: "ago_3days",
    icon: FileSpreadsheet,
    color: "text-emerald-500 bg-emerald-50",
  },
];

export default function Favorites() {
  const { t } = useLanguage();
  const [rows, setRows] = useState(initialRows);

  const unfavorite = (name) =>
    setRows((current) => current.filter((row) => row.name !== name));

  const starButton = (name) => (
    <button
      onClick={() => unfavorite(name)}
      className="shrink-0 text-amber-400 hover:text-amber-500"
    >
      <Star size={16} fill="currentColor" />
    </button>
  );

  return (
    <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:min-h-0 lg:flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          {t("favoritesTitle")}
        </h2>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-2 sm:hidden">
        {rows.map(({ name, ext, icon: Icon, color }) => (
          <div key={name} className="flex items-start justify-between rounded-lg bg-slate-50 p-3">
            <div className="flex min-w-0 flex-1 gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{name}</p>
                <p className="text-xs text-slate-400">{t("fileFormatValue", { ext })}</p>
              </div>
            </div>
            <span className="ml-2">{starButton(name)}</span>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-400">
              <th className="pb-3 font-normal">{t("name")}</th>
              <th className="pb-3 font-normal">{t("size")}</th>
              <th className="pb-3 font-normal">{t("fileFormat")}</th>
              <th className="pb-3 font-normal">{t("lastModified")}</th>
              <th className="pb-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ name, size, ext, modified, icon: Icon, color }) => (
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
                <td className="text-slate-500">{t("fileFormatValue", { ext })}</td>
                <td className="text-slate-500">{t(modified)}</td>
                <td>{starButton(name)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
