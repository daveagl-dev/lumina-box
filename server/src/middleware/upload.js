import multer from "multer";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});
