import { useEffect, useState } from "react";
import { ImageOff, Loader2, Play, Trash2, X } from "lucide-react";
import { listFiles, getDownloadUrl, deleteFile } from "../lib/api";
import { useLanguage } from "../lib/i18n";

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|mkv|avi)$/i;
const MEDIA_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|svg|mp4|webm|ogg|mov|mkv|avi)$/i;

function displayName(key) {
  return key.replace(/^[0-9a-f-]{36}-/i, "");
}

export default function Gallery() {
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  async function handleDelete(key) {
    if (!window.confirm(t("confirmDeleteImage"))) return;
    setDeletingKey(key);
    try {
      await deleteFile(key);
      setImages((prev) => prev.filter((i) => i.key !== key));
      setSelectedImage((prev) => (prev?.key === key ? null : prev));
    } catch {
      window.alert(t("deleteImageFailed"));
    } finally {
      setDeletingKey(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setStatus("loading");
      try {
        const { files } = await listFiles();
        const mediaFiles = files.filter((f) => MEDIA_EXTENSIONS.test(f.key));

        const withUrls = await Promise.all(
          mediaFiles.map(async (f) => {
            const { url } = await getDownloadUrl(f.key);
            return {
              key: f.key,
              name: displayName(f.key),
              url,
              isVideo: VIDEO_EXTENSIONS.test(f.key),
            };
          })
        );

        if (!cancelled) {
          setImages(withUrls);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadImages();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e) => e.key === "Escape" && setSelectedImage(null);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-800">{t("nav_gallery")}</h2>

      {status === "loading" ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-slate-400">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">{t("loadingImages")}</p>
        </div>
      ) : status === "error" ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 py-16 text-rose-400">
          <ImageOff size={28} />
          <p className="text-sm">{t("loadImagesError")}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-slate-400">
          <ImageOff size={28} />
          <p className="text-sm">{t("noMedia")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {images.map((img) => (
            <div
              key={img.key}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              {img.isVideo ? (
                <>
                  <video
                    src={img.url}
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = e.currentTarget.duration / 2;
                    }}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/60 text-white">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.key);
                }}
                disabled={deletingKey === img.key}
                aria-label={t("deleteItem", { name: img.name })}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white opacity-0 transition hover:bg-rose-600 group-hover:opacity-100 disabled:opacity-100"
              >
                {deletingKey === img.key ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-2">
                <p className="truncate text-xs font-medium text-white">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 p-2 backdrop-blur-sm sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <X size={18} className="sm:size-[20px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(selectedImage.key);
            }}
            disabled={deletingKey === selectedImage.key}
            className="absolute left-2 top-2 flex h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-white transition hover:bg-rose-600 sm:left-4 sm:top-4 sm:h-10"
          >
            {deletingKey === selectedImage.key ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            <span className="text-sm font-medium">{t("delete")}</span>
          </button>
          <div
            className="flex max-h-full max-w-full flex-col items-center gap-2 sm:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.isVideo ? (
              <video
                src={selectedImage.url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl sm:max-h-[80vh] sm:rounded-xl"
              />
            ) : (
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl sm:max-h-[80vh] sm:rounded-xl"
              />
            )}
            <p className="text-xs text-center text-white sm:text-sm font-medium">{selectedImage.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}
