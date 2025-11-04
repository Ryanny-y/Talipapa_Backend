import 'express';

export interface MulterS3File extends Express.Multer.File {
  location: string;
  key: string
}

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminUsername?: string;
      roles?: string[];
      file?: MulterS3File
    }
  }
}

