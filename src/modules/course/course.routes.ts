import { Router } from "express";

import {
    createCourse,
    getCourseById,
    getCourses,
    updateCourse,
    deleteCourse,
    permanentDeleteCourse
} from "./course.controller";

import { authenticate } from "../../middleware/auth.middleware";

import { isAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.post(

    "/",

    authenticate,

    isAdmin,

    createCourse

);

router.get(
    "/",
    authenticate,
    isAdmin,
    getCourses
);

router.get(

    "/:id",

    authenticate,

    isAdmin,

    getCourseById

);

router.put(

    "/:id",

    authenticate,

    isAdmin,

    updateCourse

);

router.delete("/:id", authenticate, isAdmin, deleteCourse);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteCourse);

export default router;