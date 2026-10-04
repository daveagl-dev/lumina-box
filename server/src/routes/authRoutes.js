import { Router } from "express";
import { register, login, me, uploadAvatar } from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/uploadAvatar.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/avatar", requireAuth, uploadAvatarMiddleware.single("avatar"), uploadAvatar);

export default router;
