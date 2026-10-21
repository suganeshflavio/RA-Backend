import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import { isAdmin } from "../../middleware/admin.middleware";

import {

    createStudent,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
    permanentDeleteUser

} from "./user.controller";

const router = Router();

router.post(

    "/",

    authenticate,

    isAdmin,

    createStudent

);

router.get(
    "/",
    authenticate,
    isAdmin,
    getUsers
);

router.get(
    "/:id",
    authenticate,
    isAdmin,
    getUserById
);

router.put(
    "/:id",
    authenticate,
    isAdmin,
    updateUser
);

router.delete("/:id", authenticate, isAdmin, deleteUser);

router.delete("/:id/permanent", authenticate, isAdmin, permanentDeleteUser);

export default router;