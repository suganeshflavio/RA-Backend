import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { createEnquiry, getEnquiries } from "./enquiry.controller";

const router = Router();

router.post("/", createEnquiry);
router.get("/", authenticate, requireAdmin, getEnquiries);

export default router;
