"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.refreshTokenService = exports.loginAdmin = exports.createAdmin = void 0;
const Admin_1 = __importDefault(require("../model/Admin"));
const CustomError_1 = require("../error/CustomError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAdmin = async (userData) => {
    try {
        const { username, email, contactNumber, roles, password } = userData;
        // Move all validation inside try block
        if (!username || !email || !contactNumber || !roles || !password) {
            throw new CustomError_1.CustomError(400, "All Fields are required");
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new CustomError_1.CustomError(400, "Invalid Email Format!");
        }
        if (contactNumber.length !== 11) {
            throw new CustomError_1.CustomError(400, "Invalid Contact Number!");
        }
        if (!Array.isArray(roles) || roles.length === 0) {
            throw new CustomError_1.CustomError(400, "At least one role is required!");
        }
        const validRoles = ["ADMIN", "SUPER_ADMIN"];
        if (roles.some((role) => !validRoles.includes(role))) {
            throw new CustomError_1.CustomError(400, "Invalid role(s) provided!");
        }
        const foundAdmin = await Admin_1.default.findOne({ username }).lean();
        if (foundAdmin) {
            throw new CustomError_1.CustomError(409, `Admin with username: ${username} already exists`);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newAdmin = await Admin_1.default.create({
            username,
            email,
            contactNumber,
            roles: roles,
            password: hashedPassword,
        });
        return newAdmin;
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            throw error;
        }
        throw new CustomError_1.CustomError(500, error.message || "Internal Server Error");
    }
};
exports.createAdmin = createAdmin;
const loginAdmin = async (credentials) => {
    const { username, password } = credentials;
    try {
        if (!username || !password)
            throw new CustomError_1.CustomError(400, "Username and Password are required!");
        const foundAdmin = await Admin_1.default.findOne({ username }).exec();
        if (!foundAdmin)
            throw new CustomError_1.CustomError(401, "Username or Password is incorrect.");
        const match = await bcrypt_1.default.compare(password, foundAdmin.password);
        if (match) {
            const roles = Object.values(foundAdmin.roles);
            const accessToken = jsonwebtoken_1.default.sign({
                adminInfo: {
                    _id: foundAdmin._id,
                    username: foundAdmin.username,
                    roles,
                },
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            const refreshToken = jsonwebtoken_1.default.sign({ username: foundAdmin.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            foundAdmin.refreshToken = refreshToken;
            await foundAdmin.save();
            return {
                adminData: {
                    _id: foundAdmin._id.toString(),
                    username: foundAdmin.username,
                    email: foundAdmin.email,
                    roles: foundAdmin.roles,
                },
                accessToken,
                refreshToken,
            };
        }
        else {
            throw new CustomError_1.CustomError(401, "Username or Password is incorrect.");
        }
    }
    catch (error) {
        throw error;
    }
};
exports.loginAdmin = loginAdmin;
const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) {
        throw new CustomError_1.CustomError(401, "Refresh token required");
    }
    const foundAdmin = await Admin_1.default.findOne({ refreshToken });
    if (!foundAdmin) {
        throw new CustomError_1.CustomError(403, "Invalid refresh token");
    }
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.username !== foundAdmin.username) {
                return reject(new CustomError_1.CustomError(403, "Invalid refresh token"));
            }
            const roles = Object.values(foundAdmin.roles);
            const accessToken = jsonwebtoken_1.default.sign({
                adminInfo: {
                    _id: foundAdmin._id,
                    username: foundAdmin.username,
                    roles,
                },
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            resolve({
                adminData: {
                    _id: foundAdmin._id.toString(),
                    username: foundAdmin.username,
                    email: foundAdmin.email,
                    roles: foundAdmin.roles,
                },
                accessToken: accessToken,
            });
        });
    });
};
exports.refreshTokenService = refreshTokenService;
const logoutAdmin = async (refreshToken) => {
    const foundAdmin = await Admin_1.default.findOne({ refreshToken }).exec();
    if (foundAdmin) {
        foundAdmin.refreshToken = "";
        await foundAdmin.save();
    }
    return foundAdmin;
};
exports.logoutAdmin = logoutAdmin;
