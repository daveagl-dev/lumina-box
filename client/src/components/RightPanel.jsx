import { useState, useEffect } from "react";
import { FileText, Video, Image as ImageIcon, Volume2, MoreHorizontal } from "lucide-react";
import FilesState from "./FilesState";
import { listFiles } from "../lib/api";
import { useLanguage } from "../lib/i18n";

const storageTypes = {
  documents: { label: "Documents", icon: FileText, color: "text-rose-500 bg-rose-50", hex: "#f43f5e", extensions: ["pdf", "doc", "docx", "txt", "xlsx", "xls", "ppt", "pptx"] },
  images: { label: "Images", icon: ImageIcon, color: "text-emerald-500 bg-emerald-50", hex: "#10b981", extensions: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico"] },
  videos: { label: "Videos", icon: Video, color: "text-blue-500 bg-blue-50", hex: "#3b82f6", extensions: ["mp4", "avi", "mov", "mkv", "flv", "wmv", "webm"] },
  audio: { label: "Audio", icon: Volume2, color: "text-purple-500 bg-purple-50", hex: "#a855f7", extensions: ["mp3", "wav", "aac", "ogg", "flac", "m4a", "aiff"] },
  others: { label: "Others", icon: MoreHorizontal, color: "text-amber-500 bg-amber-50", hex: "#f59e0b", extensions: [] },
};

function getFileType(key) {
  const filename = key.replace(/^[0-9a-f-]{36}-/i, "");
  const ext = filename.toLowerCase().split(".").pop();
  for (const [type, config] of Object.entries(storageTypes)) {
    if (type !== "others" && config.extensions.includes(ext)) {
      return type;
    }
  }
  return "others";
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

const SMALL_CATEGORY_BYTES = 5 * 1024 * 1024;
const totalStorageGb = 20;
const totalStorageBytes = totalStorageGb * 1024 * 1024 * 1024;
const circumference = 2 * Math.PI * 52;

export default function RightPanel({ uploadStatus }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState([]);
  const [usedBytes, setUsedBytes] = useState(0);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const data = await listFiles();
        const stats = {
          documents: { count: 0, size: 0 },
          images: { count: 0, size: 0 },
          videos: { count: 0, size: 0 },
          audio: { count: 0, size: 0 },
          others: { count: 0, size: 0 },
        };

        data.files.forEach((file) => {
          const type = getFileType(file.key);
          stats[type].count++;
          stats[type].size += file.size || 0;
        });

        const detailsList = Object.entries(stats).map(([type, stat]) => {
          const config = storageTypes[type];
          return {
            type,
            label: config.label,
            count: stat.count,
            size: formatBytes(stat.size),
            bytes: stat.size,
            icon: config.icon,
            color: config.color,
            hex: config.hex,
          };
        });

        setDetails(detailsList);
        const totalUsed = Object.values(stats).reduce((sum, s) => sum + s.size, 0);
        setUsedBytes(totalUsed);
      } catch (error) {
        console.error("Failed to load storage data:", error);
      }
    }

    loadStorageData();
  }, []);

  let offset = 0;
  const centerLabel = selected ? t("type_" + selected.type) : t("usedLabel");
  const centerValue = selected ? formatBytes(selected.bytes) : formatBytes(usedBytes);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:h-full lg:w-[28rem] lg:rounded-none lg:py-5 lg:pl-6 lg:pr-8">
      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-800">{t("storage")}</h2>
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48 lg:h-56 lg:w-56">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90 drop-shadow-sm">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f3f8" strokeWidth="13" />
            {details.filter((d) => d.bytes > 0).map((detail) => {
              const { label, bytes, hex } = detail;
              const fraction = bytes / totalStorageBytes;
              let dash = fraction * circumference;
              // Categories under 5 MB get a thinner sliver than the regular minimum
              const minDash = bytes < SMALL_CATEGORY_BYTES ? 1.5 : 5;
              if (dash > 0 && dash < minDash) dash = minDash;
              const isSelected = selected?.label === label;
              const circle = (
                <circle
                  key={label}
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={hex}
                  strokeWidth={isSelected ? 16 : 13}
                  strokeOpacity={selected && !isSelected ? 0.35 : 1}
                  strokeLinecap="butt"
                  strokeDasharray={`${dash + 0.4} ${circumference - dash - 0.4}`}
                  strokeDashoffset={-offset}
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => setSelected(isSelected ? null : detail)}
                />
              );
              offset += dash;
              return circle;
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-semibold text-slate-800 sm:text-xl lg:text-2xl">
              {centerValue}
            </span>
            <span className="text-xs text-slate-400">{centerLabel}</span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          <span className="font-medium text-slate-600">{formatBytes(usedBytes)}</span> {t("usedOf")}{" "}
          <span className="font-medium text-slate-600">{totalStorageGb} GB</span> {t("totalWord")}
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-800">{t("details")}</h2>
        <div className="flex flex-col gap-2 sm:gap-3">
          {details.map((detail) => {
            const { type, label, count, size, icon: Icon, color } = detail;
            const isSelected = selected?.label === label;
            return (
              <div
                key={label}
                onClick={() => setSelected(isSelected ? null : detail)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-1 py-0.5 transition ${
                  isSelected ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${color}`}>
                    <Icon size={16} className="sm:size-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{t("type_" + type)}</p>
                    <p className="text-xs text-slate-400">{t(count === 1 ? "filesCountOne" : "filesCount", { count })}</p>
                  </div>
                </div>
                <span className="shrink-0 ml-2 text-xs text-slate-500 sm:text-sm">{size}</span>
              </div>
            );
          })}
        </div>
      </div>

      <FilesState uploadStatus={uploadStatus} />
    </aside>
  );
}
