import {
    NextFunction,
    Request,
    Response
} from "express";

import { AppError } from "../utils/errors/AppError";
import { ZodError } from "zod";

export const errorMiddleware = (

    err: Error,

    req: Request,

    res: Response,

    next: NextFunction

) => {

     if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

    if (err instanceof AppError) {

        return res.status(err.statusCode).json({

            success: false,

            message: err.message

        });

    }

    return res.status(500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

};