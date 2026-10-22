import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
import { uploadImage } from "../../middleware/upload.middleware";
import { getInlineImage, uploadInlineImage } from "./upload.controller";

const router = Router();

router.post("/image", authenticate, isAdmin, uploadImage.single("file"), uploadInlineImage);

// Public: this is the URL embedded directly in stored rich-text HTML, so it
// has to be reachable by any viewer with no auth header attached.
router.get("/image/:id", getInlineImage);

export default router;
