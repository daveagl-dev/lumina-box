import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export default function FilesState({ uploadStatus }) {
  const { t, tError } = useLanguage();
  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

  const totalFiles = uploadStatus?.file ? 1 : 0;
  const totalSize = uploadStatus?.size || 0;

  return (
    <div className="mt-auto flex shrink-0 flex-col rounded-2xl border border-slate-100 bg-slate-50">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          {uploadStatus?.type === "loading" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{t("filesState")}</p>
          <p className="text-[11px] text-emerald-500">● {t("allSynced")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">{t("totalFiles")}</span>
          <span className="text-sm font-semibold text-slate-800">{totalFiles}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">{t("totalSize")}</span>
          <span className="text-sm font-semibold text-slate-800">{formatBytes(totalSize)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        {uploadStatus && uploadStatus.type === "success" ? (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-emerald-700">{t("uploadSuccessful")}</p>
              <p className="text-xs text-emerald-600 truncate">{t("uploadedOk", { name: uploadStatus.name })}</p>
            </div>
          </div>
        ) : uploadStatus && uploadStatus.type === "loading" ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
            <Loader2 size={14} className="animate-spin text-blue-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-700">{t("uploading")}</p>
              <p className="text-xs text-blue-600 truncate">{t("uploadingFile", { name: uploadStatus.name })}</p>
            </div>
          </div>
        ) : uploadStatus && uploadStatus.type === "error" ? (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2">
            <AlertCircle size={14} className="text-rose-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-rose-700">{t("uploadFailed")}</p>
              <p className="text-xs text-rose-600 truncate">{tError(uploadStatus.message)}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <p className="text-xs text-emerald-700">{t("allUploadsOk")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
