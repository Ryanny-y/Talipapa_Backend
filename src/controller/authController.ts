import * as authService from "../service/authService";
import { Request, Response } from "express";
import { createAdminBody } from "../types/auth/request";
import { IAdmin } from "../model/Admin";
import { handleError } from "../utils/errorResponseHandler";
import { createAdminResponse } from "../types/auth/response";
import { ErrorResponse } from "../types";

export const createAdmin = async (
  request: Request<{}, {}, createAdminBody>,
  response: Response<createAdminResponse | ErrorResponse>
) => {
  try {
    const admin: IAdmin = await authService.createAdmin(request.body);
    const responseData: createAdminResponse = {
      message: `New Admin ${admin.username} Created Successfully`,
      admin: {
        username: admin.username,
        email: admin.email,
        roles: admin.roles,
      },
    }

    return response.status(201).json(responseData);
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
      secure: process.env.NODE_ENV === "production",
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

export const refreshToken = async (request: Request, response: Response) => {
  try {
    const cookies = request.cookies;
    
    const refreshTokenFromCookie = cookies?.refreshToken;

    if(!refreshTokenFromCookie) {
      return response.sendStatus(401);
    }

    const result = await authService.refreshTokenService(refreshTokenFromCookie);
    return response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const logoutAdmin = async (request: Request, response: Response) => {
  try {
    const cookies = request.cookies;

    if(!cookies?.refreshToken) return response.sendStatus(204);
    const refreshTokenFromCookie = cookies?.refreshToken;

    const admin = await authService.logoutAdmin(refreshTokenFromCookie);


    if(!admin) {
      response.clearCookie("refreshToken", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return response.sendStatus(204);
    }

    response.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.sendStatus(204);
  } catch (error) {
    handleError(error, response);
  }
};