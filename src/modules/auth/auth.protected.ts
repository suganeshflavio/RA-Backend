import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
import { AuthRequestUser } from "../../types/express";

const router = Router();

router.get(
    "/me",
    authenticate,
    isAdmin,
    (req, res) => {

        res.json({
            success: true,
            user: req.user as AuthRequestUser,
        });

    }
);

export default router;