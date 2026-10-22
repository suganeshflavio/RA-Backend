import { Router } from "express";
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

  getVideos,
);

router.post(
    "/",
    authenticate,
    isAdmin,
    createVideo
);

router.get("/:id", authenticate, getVideoById);

router.put(
  "/:id",

  authenticate,

  isAdmin,

  updateVideo,
);

router.delete("/:id", authenticate, isAdmin, deleteVideo);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteVideo);

export default router;
