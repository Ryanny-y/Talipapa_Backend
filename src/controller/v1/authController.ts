import * as authService from '../../service/v1/authService';
import { Request, Response } from "express"
import { createAdminBody } from '../../types/requestTypes';
import { IAdmin } from '../../model/Admin';
import { CustomError } from '../../error/CustomError';

export const createAdmin = async (request: Request<{}, {}, createAdminBody>, response: Response) => {
  try {
      const admin: IAdmin = await authService.createAdmin(request.body);
      return response.status(201).json({
        message: `New Admin ${admin.username} Created Successfully`,
        admin: {
          username: admin.username,
          email: admin.email,
          roles: admin.roles,
        }
      })
  } catch (error) {
    console.log("ERROR:" + error);
      if (error instanceof CustomError) {
          return response.status(error.statusCode).json({
              message: error.message
          });
      } else {
          console.error(error);  // Log unexpected errors for debugging
          return response.status(500).json({
              message: "Something went wrong"
          });
      }
  }
};