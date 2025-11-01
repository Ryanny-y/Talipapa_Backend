import { Response } from "express";
import { CustomError } from "../error/CustomError";
import { ErrorResponse } from "../types";

export const handleError = (error: unknown, response: Response<ErrorResponse>): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorName = 'ServerError';

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
    errorName = error.name;
  } else if(error instanceof Error) {
    message = error.message;
    errorName = error.name;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: errorName,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  response.status(statusCode).json(errorResponse);
};