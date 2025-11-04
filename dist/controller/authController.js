"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.refreshToken = exports.loginAdmin = exports.createAdmin = void 0;
const authService = __importStar(require("../service/authService"));
const errorResponseHandler_1 = require("../utils/errorResponseHandler");
const createAdmin = async (request, response) => {
    try {
        const admin = await authService.createAdmin(request.body);
        const responseData = {
            message: `New Admin ${admin.username} Created Successfully`,
            admin: {
                _id: admin._id.toString(),
                username: admin.username,
                email: admin.email,
                roles: admin.roles,
            },
        };
        return response.status(201).json(responseData);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.createAdmin = createAdmin;
const loginAdmin = async (request, response) => {
    try {
        const loginResult = await authService.loginAdmin(request.body);
        if (!loginResult)
            return;
        response.cookie("refreshToken", loginResult.refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        const responseData = {
            adminData: {
                _id: loginResult.adminData._id,
                username: loginResult.adminData.username,
                email: loginResult.adminData.email,
                roles: loginResult.adminData.roles,
            },
            accessToken: loginResult.accessToken,
        };
        response.json(responseData);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.loginAdmin = loginAdmin;
const refreshToken = async (request, response) => {
    try {
        const cookies = request.cookies;
        const refreshTokenFromCookie = cookies?.refreshToken;
        if (!refreshTokenFromCookie) {
            return response.sendStatus(401);
        }
        const result = await authService.refreshTokenService(refreshTokenFromCookie);
        return response.json(result);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.refreshToken = refreshToken;
const logoutAdmin = async (request, response) => {
    try {
        const cookies = request.cookies;
        if (!cookies?.refreshToken)
            return response.sendStatus(204);
        const refreshTokenFromCookie = cookies?.refreshToken;
        const admin = await authService.logoutAdmin(refreshTokenFromCookie);
        if (!admin) {
            response.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            return response.sendStatus(204);
        }
        response.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        response.sendStatus(204);
    }
    catch (error) {
        (0, errorResponseHandler_1.handleError)(error, response);
    }
};
exports.logoutAdmin = logoutAdmin;
