import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import {
  getMyAttempts,
  getStudentAttemptByIdAdmin,
  getStudentAttemptsAdmin,
} from "./studentAttempt.controller";

const router = Router();

router.get("/admin", authenticate, requireAdmin, getStudentAttemptsAdmin);
router.get("/admin/:attemptId", authenticate, requireAdmin, getStudentAttemptByIdAdmin);
router.get("/me", authenticate, getMyAttempts);

export default router;
