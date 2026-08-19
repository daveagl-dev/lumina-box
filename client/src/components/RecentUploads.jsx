import { useEffect, useState } from "react";
import { FileText, Video, Music, Image as ImageIcon, MoreHorizontal, FileCode } from "lucide-react";
import { listFiles } from "../lib/api";

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

function getFileFormat(filename) {
  const ext = filename.toLowerCase().split(".").pop().toUpperCase();
  return ext + " file";
}

export default function RecentUploads() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await listFiles();
        const fileRows = data.files.slice(-10).reverse().map((file) => {
          const name = displayName(file.key);
          return {
            name,
            key: file.key,
            size: formatBytes(file.size),
            format: getFileFormat(name),
            modified: "Just now",
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
          Files Uploaded Recently
        </h2>
        <button className="text-xs font-medium text-coral">See all</button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-slate-400">Loading files...</div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-slate-400">No files uploaded yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
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
              {rows.map(({ name, key, size, format, modified, icon: Icon, color }) => (
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
        </div>
      )}
    </section>
  );
}
