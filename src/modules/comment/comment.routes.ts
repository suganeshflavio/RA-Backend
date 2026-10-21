import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

import {
    createComment,
    deleteComment,
    getAdminComments,
    getVideoComments,
    replyComment
} from "./comment.controller";

const router = Router();

router.post("/", authenticate, isAdmin, createComment);

router.get("/video/:videoId", authenticate, isAdmin, getVideoComments);

router.get("/", authenticate, requireAdmin, getAdminComments);

router.post("/:id/reply", authenticate, requireAdmin, replyComment);

router.delete("/:id", authenticate, requireAdmin, deleteComment);

export default router;
