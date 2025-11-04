"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwt = (request, response, next) => {
    const authHeader = (request.headers.authorization ||
        request.headers.Authorization);
    if (!authHeader?.startsWith("Bearer "))
        return response.sendStatus(401);
    const token = authHeader.split(" ")[1];
    if (!token)
        return response.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return response.status(401).json({ message: "Token expired" });
            }
            if (error.name === "JsonWebTokenError") {
                return response.status(403).json({ message: "Invalid token" });
            }
            return response
                .status(403)
                .json({ message: "Token verification failed" });
        }
        // Type guard to make TypeScript happy
        const payload = decoded;
        request.adminId = payload.adminInfo._id;
        request.adminUsername = payload.adminInfo.username;
        request.roles = payload.adminInfo.roles;
        next();
    });
};
exports.default = verifyJwt;
