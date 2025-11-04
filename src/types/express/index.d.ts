import "express";
// import type { File as MulterFile } from "multer";

export interface MulterS3File extends MulterFile {
  location: string;
  key: string;
  originalname: string;
  mimetype: string;
  size: number;
}

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminUsername?: string;
      roles?: string[];
      file?: MulterS3File;
      files?: MulterS3File[];
    }
  }
}
