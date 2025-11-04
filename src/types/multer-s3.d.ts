import { Request } from "express";

declare module "multer-s3" {
  import { StorageEngine } from "multer";
  import { S3 } from "aws-sdk";

  interface Options {
    s3: S3;
    bucket: string;
    acl?: string;
    key?: (
      req: Request<any, any, any, any>,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => void;
    metadata?: (
      req: Request<any, any, any, any>,
      file: Express.Multer.File,
      cb: (error: any, metadata?: any) => void
    ) => void;
    contentType?: any;
  }

  function multerS3(options: Options): StorageEngine;
  export default multerS3;
}
