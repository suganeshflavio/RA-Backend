import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChapters,
  permanentDeleteChapter,
  updateChapter,
} from "./chapter.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createChapter);

router.get("/", authenticate, getChapters);

router.get("/:id", authenticate, getChapterById);

router.put("/:id", authenticate, isAdmin, updateChapter);

router.delete("/:id", authenticate, isAdmin, deleteChapter);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteChapter);

export default router;
