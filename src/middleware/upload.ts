import multer, { FileFilterCallback } from "multer";
import multerS3 from 'multer-s3';
import s3Bucket from "../config/s3BucketConfig";
import { Request } from "express";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3Bucket,
    bucket: process.env.AWS_BUCKET_NAME as string,
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
})

export default upload;