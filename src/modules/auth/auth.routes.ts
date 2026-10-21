import { Router } from "express";
import protectedRoutes from "./auth.protected";
import {
    adminLoginController,
    checkStudentEmailController,
    logoutController,
    resetStudentPasswordController,
    studentLoginController,
    studentRegisterController
} from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post(

    "/admin/login",

    adminLoginController

);

router.post(
    "/login",
    studentLoginController
);

router.post("/register", studentRegisterController);

router.post("/forgot-password/check-email", checkStudentEmailController);

router.post("/forgot-password/reset", resetStudentPasswordController);

router.post(
    "/logout",
    authenticate,
    logoutController
);

router.use(protectedRoutes);
export default router;