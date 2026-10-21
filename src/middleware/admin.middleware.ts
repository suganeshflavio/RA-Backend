import { NextFunction, Request, Response } from "express";

export const isAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (req.user?.role !== "ADMIN" && req.user?.role !== "STUDENT") {

        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });

    }

    next();

};

// Strictly ADMIN-only, unlike isAdmin above (which also passes STUDENT).
export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (req.user?.role !== "ADMIN") {

        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });

    }

    next();

};