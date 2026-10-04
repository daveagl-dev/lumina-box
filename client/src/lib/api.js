import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  return response.json();
}

export async function listFiles() {
  const response = await fetch(`${API_BASE_URL}/api/files`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to list files");
  return response.json();
}

export async function getDownloadUrl(key) {
  const response = await fetch(`${API_BASE_URL}/api/files/${encodeURIComponent(key)}/download`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to get download URL");
  return response.json();
}

export async function deleteFile(key) {
  const response = await fetch(`${API_BASE_URL}/api/files/${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete file");
  }
}
