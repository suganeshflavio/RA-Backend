import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";

import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  permanentDeleteClass,
  updateClass,
} from "./class.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createClass);

router.get("/", authenticate, getClasses);

router.get("/:id", authenticate, getClassById);

router.put("/:id", authenticate, isAdmin, updateClass);

router.delete("/:id", authenticate, isAdmin, deleteClass);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteClass);

export default router;
