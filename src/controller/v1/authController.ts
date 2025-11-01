import * as authService from "../../service/v1/authService";
import { Request, Response } from "express";
import { createAdminBody } from "../../types/requestTypes";
import { IAdmin } from "../../model/Admin";
import { handleError } from "../../utils/errorResponseHandler";

export const createAdmin = async (
  request: Request<{}, {}, createAdminBody>,
  response: Response
) => {
  try {
    const admin: IAdmin = await authService.createAdmin(request.body);
    return response.status(201).json({
      message: `New Admin ${admin.username} Created Successfully`,
      admin: {
        username: admin.username,
        email: admin.email,
        roles: admin.roles,
      },
    });
  } catch (error) {
    handleError(error, response);
  }
};

export const loginAdmin = async (request: Request<{}, {}, { username: string, password: string }>, response: Response) => {
  try {
    const loginResult = await authService.loginAdmin(request.body);

    if(!loginResult) return;
    
    response.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false,
      sameSite: 'strict',
    });

    response.json({
      userData: {
        username: loginResult.userData.username,
        _id: loginResult.userData._id,
        roles: loginResult.userData.roles,
      },
      accessToken: loginResult.accessToken,
    });
  } catch (error) {
    handleError(error, response);
  }
}
