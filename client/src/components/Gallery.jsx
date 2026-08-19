import { useEffect, useState } from "react";
import { ImageOff, Loader2, X } from "lucide-react";
import { listFiles, getDownloadUrl } from "../lib/api";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;

function displayName(key) {
  return key.replace(/^[0-9a-f-]{36}-/i, "");
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setStatus("loading");
      try {
        const { files } = await listFiles();
        const imageFiles = files.filter((f) => IMAGE_EXTENSIONS.test(f.key));

        const withUrls = await Promise.all(
          imageFiles.map(async (f) => {
            const { url } = await getDownloadUrl(f.key);
            return { key: f.key, name: displayName(f.key), url };
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
      <h2 className="mb-3 text-base font-semibold text-slate-800">Gallery</h2>

      {status === "loading" ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-slate-400">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Loading images...</p>
        </div>
      ) : status === "error" ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 py-16 text-rose-400">
          <ImageOff size={28} />
          <p className="text-sm">Couldn't load images. Is the server running?</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-slate-400">
          <ImageOff size={28} />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {images.map((img) => (
            <div
              key={img.key}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={img.url}
                alt={img.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
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
          <div
            className="flex max-h-full max-w-full flex-col items-center gap-2 sm:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl sm:max-h-[80vh] sm:rounded-xl"
            />
            <p className="text-xs text-center text-white sm:text-sm font-medium">{selectedImage.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}
