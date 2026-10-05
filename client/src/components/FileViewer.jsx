import { X } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export default function FileViewer({ viewer, onClose }) {
  const { t } = useLanguage();
  if (!viewer) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 p-2 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className={`flex w-full flex-col ${viewer.pdfUrl ? "h-[85vh] max-w-5xl" : "max-h-[85vh] max-w-3xl"} overflow-hidden rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="truncate text-sm font-semibold text-slate-800">{viewer.name}</h3>
          <button onClick={onClose} className="ml-3 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <div className={`min-h-0 flex-1 ${viewer.pdfUrl ? "" : "overflow-auto p-4"}`}>
          {viewer.status === "loading" ? (
            <p className="text-sm text-slate-400">{t("loadingFileContent")}</p>
          ) : viewer.status === "error" ? (
            <p className="text-sm text-rose-500">{t("fileContentError")}</p>
          ) : viewer.pdfUrl ? (
            <iframe src={viewer.pdfUrl} title={viewer.name} className="h-full w-full border-0" />
          ) : (
            <>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-700">{viewer.text}</pre>
              {viewer.truncated && <p className="mt-3 text-xs text-slate-400">{t("fileTruncated")}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
