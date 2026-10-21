import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createVideo,
  getVideoById,
  getVideos,
  updateVideo,
  deleteVideo,
  permanentDeleteVideo,
  requestVideoUploadUrl,
} from "./video.controller";

const router = Router();

router.post(
  "/upload-url",

  authenticate,

  isAdmin,

  requestVideoUploadUrl,
);

router.get(
  "/",

  authenticate,

  isAdmin,

  getVideos,
);

router.post(
    "/",
    authenticate,
    isAdmin,
    upload.single("notesUrl"),
    createVideo
);

router.get("/:id", authenticate, isAdmin, getVideoById);

router.put(
  "/:id",

  authenticate,

  isAdmin,

  upload.single("notesUrl"),

  updateVideo,
);

router.delete("/:id", authenticate, isAdmin, deleteVideo);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteVideo);

export default router;
