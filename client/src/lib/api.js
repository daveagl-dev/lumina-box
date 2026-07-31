const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  return response.json();
}

export async function listFiles() {
  const response = await fetch(`${API_BASE_URL}/api/files`);
  if (!response.ok) throw new Error("Failed to list files");
  return response.json();
}

export async function getDownloadUrl(key) {
  const response = await fetch(`${API_BASE_URL}/api/files/${encodeURIComponent(key)}/download`);
  if (!response.ok) throw new Error("Failed to get download URL");
  return response.json();
}
