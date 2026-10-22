import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createNotes,
  deleteNotes,
  getNotesById,
  getNotesList,
  permanentDeleteNotes,
  updateNotes,
} from "./notes.controller";

const router = Router();

router.get("/", authenticate, getNotesList);

router.post("/", authenticate, isAdmin, upload.single("file"), createNotes);

router.get("/:id", authenticate, getNotesById);

router.put("/:id", authenticate, isAdmin, upload.single("file"), updateNotes);

router.delete("/:id", authenticate, isAdmin, deleteNotes);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteNotes);

export default router;
