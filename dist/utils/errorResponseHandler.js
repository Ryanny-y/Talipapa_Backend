"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const CustomError_1 = require("../error/CustomError");
const handleError = (error, response) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorName = 'Server Error';
    if (error instanceof CustomError_1.CustomError) {
        statusCode = error.statusCode;
        message = error.message;
        errorName = "Custom Error";
    }
    else if (error instanceof Error) {
        message = error.message;
        errorName = error.name;
    }
    const errorResponse = {
        success: false,
        error: errorName,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
    };
    response.status(statusCode).json(errorResponse);
};
exports.handleError = handleError;
