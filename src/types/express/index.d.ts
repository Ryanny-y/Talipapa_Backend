// types/express/index.ts
import 'express';
import type { File as MulterFile } from 'multer';

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminUsername?: string;
      roles?: string[];
    }
  }
}