import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  permanentDeleteSubject,
  updateSubject,
} from "./subject.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createSubject);

router.get("/", authenticate, getSubjects);

router.get("/:id", authenticate, getSubjectById);

router.put("/:id", authenticate, isAdmin, updateSubject);

router.delete("/:id", authenticate, isAdmin, deleteSubject);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteSubject);

export default router;
