import React, { useEffect, useState } from "react";
import { FileText, Music, Video, Image as ImageIcon, FileCode, Plus, X } from "lucide-react";
import { listFiles } from "../lib/api";
import { useLanguage } from "../lib/i18n";

function displayName(key) {
  return key.replace(/^[0-9a-f-]{36}-/i, "");
}

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

function formatDate(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function QuickAccess() {
  const { t } = useLanguage();
  const [quickAccess, setQuickAccess] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSelectingQuickAccess, setIsSelectingQuickAccess] = useState(false);

  useEffect(() => {
    const savedQuickAccess = localStorage.getItem("quickAccess");
    if (savedQuickAccess) {
      try {
        const parsed = JSON.parse(savedQuickAccess);
        const enhanced = parsed.map((f) => ({
          ...f,
          icon: getFileIcon(f.name || displayName(f.key)),
          color: getFileColor(f.name || displayName(f.key)),
        }));
        setQuickAccess(enhanced);
      } catch (error) {
        console.error("Failed to load quick access:", error);
      }
    }
  }, []);

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await listFiles();
        const fileList = data.files.map((f) => ({
          key: f.key,
          name: displayName(f.key),
          size: f.size,
          lastModified: f.lastModified,
          icon: getFileIcon(f.name || displayName(f.key)),
          color: getFileColor(f.name || displayName(f.key)),
        }));
        setFiles(fileList);
      } catch (error) {
        console.error("Failed to load files:", error);
      }
    }

    loadFiles();
  }, []);

  const handleAddQuickAccess = (file) => {
    if (quickAccess.length < 4 && !quickAccess.find((f) => f.key === file.key)) {
      const newQuickAccess = [...quickAccess, file];
      setQuickAccess(newQuickAccess);
      localStorage.setItem("quickAccess", JSON.stringify(newQuickAccess));
      setIsSelectingQuickAccess(false);
    }
  };

  const handleRemoveQuickAccess = (fileKey) => {
    const newQuickAccess = quickAccess.filter((f) => f.key !== fileKey);
    setQuickAccess(newQuickAccess);
    localStorage.setItem("quickAccess", JSON.stringify(newQuickAccess));
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">{t("quickAccess")}</h2>
        {quickAccess.length > 0 && quickAccess.length < 4 && (
          <button
            onClick={() => setIsSelectingQuickAccess(true)}
            className="text-xs font-medium text-coral hover:text-coral/80"
          >
            {t("addFiles")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:grid-cols-3 md:grid-cols-4 sm:gap-3 md:gap-4">
        {quickAccess.map((file) => {
          const Icon = file.icon;
          return (
            <div key={file.key} className="group relative rounded-lg bg-white p-3 shadow-sm transition hover:shadow-md sm:rounded-2xl sm:p-4">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${file.color}`}>
                  {React.createElement(Icon, { size: 16 })}
                </div>
                <button
                  onClick={() => handleRemoveQuickAccess(file.key)}
                  className="rounded-md p-0.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-50 hover:text-slate-600 sm:p-1"
                >
                  <X size={14} className="sm:size-[16px]" />
                </button>
              </div>
              <p className="mb-0.5 truncate text-xs font-medium text-slate-800 sm:mb-1 sm:text-sm">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
          );
        })}
        {quickAccess.length < 4 && (
          <button
            onClick={() => setIsSelectingQuickAccess(true)}
            className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-coral/40 hover:text-coral sm:min-h-[120px] sm:rounded-2xl"
          >
            <Plus size={18} className="sm:size-[20px]" />
            <span className="text-xs font-medium sm:text-sm">{t("addFile")}</span>
          </button>
        )}
      </div>

      {isSelectingQuickAccess && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
          onClick={() => setIsSelectingQuickAccess(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-white p-4 shadow-xl sm:w-[calc(100%-2rem)] sm:max-w-md sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                {t("addToQuickAccess", { count: quickAccess.length })}
              </h3>
              <button
                onClick={() => setIsSelectingQuickAccess(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {files.filter((f) => !quickAccess.find((qa) => qa.key === f.key)).length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">{t("noFilesAvailable")}</p>
              ) : (
                <div className="space-y-2">
                  {files
                    .filter((f) => !quickAccess.find((qa) => qa.key === f.key))
                    .map((file) => {
                      const Icon = file.icon;
                      return (
                        <button
                          key={file.key}
                          onClick={() => handleAddQuickAccess(file)}
                          className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50"
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${file.color}`}>
                            {React.createElement(Icon, { size: 16 })}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
