"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3BucketConfig_1 = __importDefault(require("../config/s3BucketConfig"));
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
console.log(process.env.AWS_BUCKET_NAME);
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3BucketConfig_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        key(req, file, callback) {
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
            callback(null, `uploads/${fileName}`);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
});
exports.default = upload;
