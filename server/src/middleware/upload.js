import multer from "multer";

const MAX_FILE_SIZE_BYTES = 300 * 1024 * 1024; // 300 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});
