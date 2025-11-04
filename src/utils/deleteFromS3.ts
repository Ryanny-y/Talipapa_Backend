import s3Bucket from "../config/s3BucketConfig";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CustomError } from "../error/CustomError";

const deleteFromS3 = async (key: string) => {
  try {
    const deleteProps = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
    };
    const command = new DeleteObjectCommand(deleteProps);
    const res = await s3Bucket.send(command);
    console.log(res);
    
  } catch (error: any) {
    if (error.name === "NoSuchKey") {
      throw new CustomError(404, "File not found in S3");
    }

    if (error.name === "AccessDenied") {
      throw new CustomError(403, "Access denied to S3 bucket");
    }

    if (error.name === "ServiceUnavailable") {
      throw new CustomError(503, "S3 service unavailable");
    }

    // Default catch-all
    throw new CustomError(500, "Error deleting file from S3");
  }
};

export default deleteFromS3;