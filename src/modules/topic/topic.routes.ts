import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createTopic,
  deleteTopic,
  getTopicById,
  getTopics,
  linkMcqTestToTopic,
  linkNotesToTopic,
  linkVideoToTopic,
  permanentDeleteTopic,
  unlinkMcqTestFromTopic,
  unlinkNotesFromTopic,
  unlinkVideoFromTopic,
  updateTopic,
} from "./topic.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createTopic);

router.get("/", authenticate, getTopics);

router.get("/:id", authenticate, getTopicById);

router.put("/:id", authenticate, isAdmin, updateTopic);

router.delete("/:id", authenticate, isAdmin, deleteTopic);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteTopic);

router.post("/:id/videos", authenticate, isAdmin, linkVideoToTopic);
router.delete("/:id/videos/:videoId", authenticate, isAdmin, unlinkVideoFromTopic);

router.post("/:id/mcq-tests", authenticate, isAdmin, linkMcqTestToTopic);
router.delete("/:id/mcq-tests/:testId", authenticate, isAdmin, unlinkMcqTestFromTopic);

router.post("/:id/notes", authenticate, isAdmin, linkNotesToTopic);
router.delete("/:id/notes/:notesId", authenticate, isAdmin, unlinkNotesFromTopic);

export default router;
