import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode
    }
}

interface ErrorResponse {
    success: boolean;
    message: string;
    stack?: string;
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal server error";

    const response: ErrorResponse = {
        success: false,
        message
    }

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack
    }

    res.status(statusCode).json(response)
}