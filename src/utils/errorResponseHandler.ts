import { Response } from "express";
import { CustomError } from "../error/CustomError";

export const handleError = (error: unknown, response: Response): Response => {
  if (error instanceof CustomError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    console.error(error);
    return response.status(500).json({
      message: "Something went wrong",
    });
  }
};