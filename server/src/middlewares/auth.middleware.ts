import { getAuth, requireAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { db } from "../config/db.js";
import { ENV } from "../config/env.js";

export const protectedRoute = [
    requireAuth(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = getAuth(req);

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" })
            }

            const user = await db.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            req.user = user

            next()
        } catch (error) {
            console.error("Error in protectedRoute middleware", error);
            return res.status(500).json({ message: "Internal server error" })
        }
    }
]

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - user not found" })
    }

    if (req.user.email !== ENV.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Forbidden - admin access only" })
    }

    next();
}