import { useEffect, useState } from "react";
import { getTextContent, getDownloadUrl } from "./api";

const isTextFile = (name) => /\.txt$/i.test(name);
const isPdfFile = (name) => /\.pdf$/i.test(name);
export const isViewable = (name) => isTextFile(name) || isPdfFile(name);

// Shared by every list that opens files: only .txt and .pdf are viewable, in the FileViewer modal
export function useFileViewer() {
  const [viewer, setViewer] = useState(null);

  const openFile = async (file) => {
    if (!isViewable(file.name)) return;
    setViewer({ name: file.name, status: "loading" });
    try {
      if (isPdfFile(file.name)) {
        const { url } = await getDownloadUrl(file.key);
        setViewer({ name: file.name, status: "ready", pdfUrl: url });
        return;
      }
      const { text, truncated } = await getTextContent(file.key);
      setViewer({ name: file.name, status: "ready", text, truncated });
    } catch {
      setViewer({ name: file.name, status: "error" });
    }
  };

  const closeViewer = () => setViewer(null);

  useEffect(() => {
    if (!viewer) return;
    const onKey = (e) => e.key === "Escape" && setViewer(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);

  return { viewer, openFile, closeViewer };
}
