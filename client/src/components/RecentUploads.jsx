import { useEffect, useState } from "react";
import { FileText, Video, Music, Image as ImageIcon, MoreHorizontal, FileCode } from "lucide-react";
import { listFiles } from "../lib/api";
import { useLanguage } from "../lib/i18n";

function getFileIcon(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  if (["pdf"].includes(ext)) return FileText;
  if (["mp4", "avi", "mov", "mkv"].includes(ext)) return Video;
  if (["mp3", "wav", "aac", "ogg", "flac", "m4a"].includes(ext)) return Music;
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return ImageIcon;
  return FileCode;
}

function getFileColor(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "pdf") return "text-rose-500 bg-rose-50";
  if (["mp4", "avi", "mov", "mkv"].includes(ext)) return "text-blue-500 bg-blue-50";
  if (["mp3", "wav", "aac", "ogg", "flac", "m4a"].includes(ext)) return "text-purple-500 bg-purple-50";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return "text-emerald-500 bg-emerald-50";
  return "text-slate-500 bg-slate-50";
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function displayName(key) {
  return key.replace(/^[0-9a-f-]{36}-/i, "");
}

function getFileExt(filename) {
  return filename.toLowerCase().split(".").pop().toUpperCase();
}

const RECENT_LIMIT = 5;

export default function RecentUploads() {
  const { t } = useLanguage();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await listFiles();
        const fileRows = [...data.files]
          .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
          .slice(0, RECENT_LIMIT)
          .map((file) => {
          const name = displayName(file.key);
          return {
            name,
            key: file.key,
            size: formatBytes(file.size),
            ext: getFileExt(name),
            icon: getFileIcon(name),
            color: getFileColor(name),
          };
        });
        setRows(fileRows);
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFiles();
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:min-h-0 lg:flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          {t("recentUploads")}
        </h2>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-slate-400">{t("loadingFiles")}</div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-slate-400">{t("noFilesYet")}</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {rows.map(({ name, key, size, ext, icon: Icon, color }) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{t("fileFormatValue", { ext })}</p>
                  </div>
                </div>
                <div className="shrink-0 ml-2 text-right">
                  <p className="text-xs text-slate-500">{size}</p>
                </div>
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
                {rows.map(({ name, key, size, ext, icon: Icon, color }) => (
                  <tr key={key} className="border-t border-slate-100">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-500">{size}</td>
                    <td className="text-slate-500">{t("fileFormatValue", { ext })}</td>
                    <td className="text-slate-500">{t("justNow")}</td>
                    <td>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
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
