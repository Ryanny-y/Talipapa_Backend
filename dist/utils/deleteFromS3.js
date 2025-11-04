"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3BucketConfig_1 = __importDefault(require("../config/s3BucketConfig"));
const client_s3_1 = require("@aws-sdk/client-s3");
const CustomError_1 = require("../error/CustomError");
const deleteFromS3 = async (key) => {
    try {
        const deleteProps = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        const command = new client_s3_1.DeleteObjectCommand(deleteProps);
        const res = await s3BucketConfig_1.default.send(command);
        console.log(res);
    }
    catch (error) {
        if (error.name === "NoSuchKey") {
            throw new CustomError_1.CustomError(404, "File not found in S3");
        }
        if (error.name === "AccessDenied") {
            throw new CustomError_1.CustomError(403, "Access denied to S3 bucket");
        }
        if (error.name === "ServiceUnavailable") {
            throw new CustomError_1.CustomError(503, "S3 service unavailable");
        }
        // Default catch-all
        throw new CustomError_1.CustomError(500, "Error deleting file from S3");
    }
};
exports.default = deleteFromS3;
