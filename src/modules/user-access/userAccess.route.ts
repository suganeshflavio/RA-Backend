import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
import { assignUserAccess, getUserAccessByUserId, updateUserAccess } from "./userAccess.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    isAdmin,
    assignUserAccess
);

router.get("/:userId", authenticate, isAdmin, getUserAccessByUserId);

router.put("/:userId", authenticate, isAdmin, updateUserAccess);

export default router;