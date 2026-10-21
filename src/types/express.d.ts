import "express";

export interface AuthRequestUser {
    userId: string;
    role: "ADMIN" | "STUDENT";
    sessionToken: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthRequestUser;
        }
    }
}

export {};