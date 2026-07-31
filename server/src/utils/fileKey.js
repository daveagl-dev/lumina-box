import { randomUUID } from "crypto";

export function buildFileKey(originalName) {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${randomUUID()}-${safeName}`;
}
