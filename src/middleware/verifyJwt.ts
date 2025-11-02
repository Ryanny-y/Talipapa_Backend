import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyJwt = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = (request.headers.authorization ||
    request.headers.Authorization) as string | undefined;

  if (!authHeader?.startsWith("Bearer ")) return response.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return response.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return response.status(401).json({ message: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
          return response.status(403).json({ message: "Invalid token" });
        }
        return response
          .status(403)
          .json({ message: "Token verification failed" });
      }

      // Type guard to make TypeScript happy
      const payload = decoded as JwtPayload & {
        adminInfo: {
          _id: string;
          username: string;
          roles: string[];
        };
      };

      request.adminId = payload.adminInfo._id;
      request.adminUsername = payload.adminInfo.username;
      request.roles = payload.adminInfo.roles;

      next();
    }
  );
};

export default verifyJwt;
