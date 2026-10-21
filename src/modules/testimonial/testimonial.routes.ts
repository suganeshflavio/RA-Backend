import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin, requireAdmin } from "../../middleware/admin.middleware";

import {
    createTestimonial,
    deleteTestimonial,
    getPublicTestimonials,
    getTestimonials,
    updateTestimonial
} from "./testimonial.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createTestimonial);

router.get("/public", authenticate, isAdmin, getPublicTestimonials);

router.get("/", authenticate, requireAdmin, getTestimonials);

router.put("/:id", authenticate, requireAdmin, updateTestimonial);

router.delete("/:id", authenticate, requireAdmin, deleteTestimonial);

export default router;
