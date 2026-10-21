import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const authorization = req.headers.authorization;

        if (!authorization) {

            return res.status(401).json({
                success: false,
                message: "Token Missing"
            });

        }

        const token = authorization.replace("Bearer ", "");

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });

        }

        if (!user.isActive) {

            return res.status(401).json({
                success: false,
                message: "Account Deactivated. Contact Admin."
            });

        }

        if (user.sessionToken !== decoded.sessionToken) {

            return res.status(401).json({
                success: false,
                message: "Session Expired. Login Again."
            });

        }

        req.user = {
            userId: user.id,
            role: user.role,
            sessionToken: user.sessionToken!
        };

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};