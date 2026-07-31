import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  uploadFile,
  listFiles,
  getDownloadUrl,
  deleteFile,
} from "../controllers/filesController.js";

const router = Router();

router.post("/", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.get("/:key/download", getDownloadUrl);
router.delete("/:key", deleteFile);

export default router;
