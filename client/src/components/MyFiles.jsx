import React, { useEffect, useState } from "react";
import { Folder, Plus, X, Check, MoreHorizontal, Trash2, FileText, Video, Image as ImageIcon, Music, FileCode } from "lucide-react";
import { listFiles, deleteFile } from "../lib/api";
import { useFileViewer, isViewable } from "../lib/useFileViewer";
import FileViewer from "./FileViewer";
import { useLanguage } from "../lib/i18n";

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
    files: 0,
    barColor: "bg-rose-400",
    iconBg: "bg-rose-50 text-rose-500",
  },
];

const CUSTOM_FOLDERS_KEY = "customFolders";
const FOLDER_FILES_KEY = "folderFiles";

function loadFolderFiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(FOLDER_FILES_KEY));
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function loadCustomFolders() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_FOLDERS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
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

function formatDate(dateString, locale, unknown) {
  if (!dateString) return unknown;
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function displayName(key) {
  return key.replace(/^[0-9a-f-]{36}-/i, "");
}

export default function MyFiles({ onFolderOpen }) {
  const { t, locale } = useLanguage();
  const [folders, setFolders] = useState(() => [...initialFolders, ...loadCustomFolders()]);
  const [files, setFiles] = useState([]);
  // Custom folder name -> keys of the files the user added to it
  const [folderFiles, setFolderFiles] = useState(loadFolderFiles);
  const [isAdding, setIsAdding] = useState(false);
  const [pickedKeys, setPickedKeys] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorOptions[0]);
  const [openMenu, setOpenMenu] = useState(null);
  const [openFileMenu, setOpenFileMenu] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const { viewer, openFile: openTextFile, closeViewer } = useFileViewer();

  // Custom folders persist until the user deletes them
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_FOLDERS_KEY, JSON.stringify(folders.filter((f) => f.custom)));
    } catch {
      // localStorage unavailable
    }
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLDER_FILES_KEY, JSON.stringify(folderFiles));
    } catch {
      // localStorage unavailable
    }
  }, [folderFiles]);

  useEffect(() => {
    async function loadFiles() {
      setIsLoadingFiles(true);
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
        setFolders((prev) => prev.map((f) => (f.custom ? f : { ...f, files: fileList.length })));
      } catch (error) {
        console.error("Failed to load files:", error);
      } finally {
        setIsLoadingFiles(false);
      }
    }

    loadFiles();
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    setFolders([
      ...folders,
      {
        name: name.trim(),
        files: 0,
        barColor: color.barColor,
        iconBg: color.iconBg,
        custom: true,
      },
    ]);
    setName("");
    setColor(colorOptions[0]);
    setIsCreating(false);
  };

  const currentFolder = folders.find((f) => f.name === selectedFolder);
  const folderKeys = (folderName) => folderFiles[folderName] || [];
  // Custom folders only show files added to them; "All Files" shows everything
  const visibleFiles = currentFolder?.custom ? files.filter((f) => folderKeys(currentFolder.name).includes(f.key)) : files;

  // Cloud files not yet in the open custom folder
  const addableFiles = currentFolder?.custom ? files.filter((f) => !folderKeys(currentFolder.name).includes(f.key)) : [];

  const closeAddPicker = () => {
    setIsAdding(false);
    setPickedKeys([]);
  };

  const togglePicked = (key) =>
    setPickedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const handleAddToFolder = () => {
    if (pickedKeys.length) {
      setFolderFiles((prev) => ({ ...prev, [currentFolder.name]: [...(prev[currentFolder.name] || []), ...pickedKeys] }));
    }
    closeAddPicker();
  };

  const handleDelete = (folderName) => {
    setFolders(folders.filter((f) => f.name !== folderName));
    setFolderFiles(({ [folderName]: _removed, ...rest }) => rest);
    setOpenMenu(null);
  };

  const handleDeleteFile = async (fileKey) => {
    try {
      await deleteFile(fileKey);
      setFiles(files.filter((f) => f.key !== fileKey));
      setOpenFileMenu(null);
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert(t("deleteFileFailed"));
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          {t("myFiles")}
        </h2>
        {selectedFolder && (
          <div className="flex items-center gap-4">
            {currentFolder?.custom && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs font-medium text-coral hover:underline"
              >
                {t("addFile")}
              </button>
            )}
            <button
              onClick={() => {
                setSelectedFolder(null);
                onFolderOpen?.(false);
              }}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              {t("backToFolders")}
            </button>
          </div>
        )}
      </div>

      {selectedFolder ? (
        isLoadingFiles ? (
          <div className="flex items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-slate-400">{t("loadingFiles")}</p>
          </div>
        ) : visibleFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-slate-400">{t("noFilesYet")}</p>
          </div>
        ) : (
          <>
            {/* Mobile/Tablet Card View */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
              {visibleFiles.map((file) => {
                const Icon = file.icon;
                return (
                  <div
                    key={file.key}
                    onClick={() => openTextFile(file)}
                    className={`flex items-center justify-between rounded-lg bg-white p-4 shadow-sm ${isViewable(file.name) ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${file.color}`}>
                        {React.createElement(Icon, { size: 16 })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <div className="relative flex shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenFileMenu(openFileMenu === file.key ? null : file.key);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {openFileMenu === file.key && (
                        <div className="absolute right-0 top-8 z-10 w-32 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file.key);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 size={14} />
                            {t("delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 font-medium text-slate-600">{t("fileName")}</th>
                    <th className="px-4 py-3 font-medium text-slate-600">{t("size")}</th>
                    <th className="px-4 py-3 font-medium text-slate-600">{t("uploadDate")}</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFiles.map((file) => {
                    const Icon = file.icon;
                    return (
                      <tr
                        key={file.key}
                        onClick={() => openTextFile(file)}
                        className={`border-t border-slate-100 transition hover:bg-slate-50 ${isViewable(file.name) ? "cursor-pointer" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${file.color}`}>
                              {React.createElement(Icon, { size: 16 })}
                            </div>
                            <p className="font-medium text-slate-800">{file.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatBytes(file.size)}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(file.lastModified, locale, t("unknown"))}</td>
                        <td className="px-4 py-3">
                          <div className="relative flex justify-end">
                            <button
                              onClick={(e) => {
                          e.stopPropagation();
                          setOpenFileMenu(openFileMenu === file.key ? null : file.key);
                        }}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {openFileMenu === file.key && (
                              <div className="absolute right-0 top-8 z-10 w-32 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFile(file.key);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 size={14} />
                                  {t("delete")}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )
      ) : (
        <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:grid-cols-3 md:grid-cols-4 sm:gap-3 md:gap-4">
          {folders.map((f) => {
            const count = f.custom ? files.filter((file) => folderKeys(f.name).includes(file.key)).length : f.files;
            return (
            <div
              key={f.name}
              onClick={() => {
                setSelectedFolder(f.name);
                onFolderOpen?.(true);
              }}
              className="relative cursor-pointer rounded-lg bg-white p-3 shadow-sm transition hover:shadow-md sm:rounded-2xl sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${f.iconBg}`}>
                  <Folder size={16} className="sm:size-[18px]" />
                </div>
                {f.custom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === f.name ? null : f.name);
                    }}
                    className="rounded-md p-0.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 sm:p-1"
                  >
                    <MoreHorizontal size={14} className="sm:size-[16px]" />
                  </button>
                )}
              </div>
              <p className="mb-0.5 text-sm font-medium text-slate-800 sm:mb-1">{f.custom ? f.name : t("allFiles")}</p>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{t(count === 1 ? "filesCountOne" : "filesCount", { count })}</span>
                <span>{t("justNow")}</span>
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
                    {t("delete")}
                  </button>
                </div>
              )}
            </div>
            );
          })}

          <button
            onClick={() => setIsCreating(true)}
            className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-coral/40 hover:text-coral sm:min-h-[132px] sm:rounded-2xl"
          >
            <Plus size={18} className="sm:size-[20px]" />
            <span className="text-xs font-medium sm:text-sm">{t("newFolder")}</span>
          </button>
        </div>
      )}

      <FileViewer viewer={viewer} onClose={closeViewer} />

      {isAdding && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
          onClick={closeAddPicker}
        >
          <div
            className="flex max-h-[80vh] w-full flex-col rounded-t-2xl bg-white p-4 shadow-xl sm:w-[calc(100%-2rem)] sm:max-w-md sm:rounded-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{t("addFile")}</h3>
              <button onClick={closeAddPicker} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {addableFiles.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">{t("noFilesToAdd")}</p>
            ) : (
              <ul className="mb-4 flex min-h-0 flex-col gap-1 overflow-y-auto">
                {addableFiles.map((file) => {
                  const Icon = file.icon;
                  const picked = pickedKeys.includes(file.key);
                  return (
                    <li key={file.key}>
                      <button
                        onClick={() => togglePicked(file.key)}
                        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-slate-50 ${picked ? "bg-slate-50" : ""}`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${file.color}`}>
                          {React.createElement(Icon, { size: 16 })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                        </div>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            picked ? "border-coral bg-coral text-white" : "border-slate-300"
                          }`}
                        >
                          {picked && <Check size={14} />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              onClick={handleAddToFolder}
              disabled={pickedKeys.length === 0}
              className="w-full rounded-lg bg-coral py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("addSelected")}
            </button>
          </div>
        </div>
      )}

      {isCreating && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-white p-4 shadow-xl sm:w-[calc(100%-2rem)] sm:max-w-80 sm:rounded-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{t("newFolder")}</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${color.iconBg}`}>
                <Folder size={24} className="sm:size-[26px]" />
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-slate-500">{t("folderName")}</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder={t("folderPlaceholder")}
              className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-coral"
            />

            <label className="mb-2 block text-xs font-medium text-slate-500">{t("iconColor")}</label>
            <div className="mb-5 flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full sm:h-7 sm:w-7 ${c.barColor} ${
                    color.name === c.name ? "ring-2 ring-offset-2 ring-slate-400" : ""
                  }`}
                  aria-label={t("color_" + c.name)}
                />
              ))}
            </div>

            <button
              onClick={handleCreate}
              className="w-full rounded-lg bg-coral py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t("create")}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
