import * as authService from "../service/authService";
import { Request, Response } from "express";
import { AdminLoginBody, CreateAdminBody } from "../types/auth/request";
import { IAdmin } from "../model/Admin";
import { handleError } from "../utils/errorResponseHandler";
import {
  CreateAdminResponse,
  LoginAdminResponse,
  RefreshTokenResponse,
} from "../types/auth/response";
import { ErrorResponse } from "../types";

export const createAdmin = async (
  request: Request<{}, {}, CreateAdminBody>,
  response: Response<CreateAdminResponse | ErrorResponse>
) => {
  try {
    const admin: IAdmin = await authService.createAdmin(request.body);
    const responseData: CreateAdminResponse = {
      message: `New Admin ${admin.username} Created Successfully`,
      admin: {
        _id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        roles: admin.roles,
      },
    };

    return response.status(201).json(responseData);
  } catch (error) {
    handleError(error, response);
  }
};

export const loginAdmin = async (
  request: Request<{}, {}, AdminLoginBody>,
  response: Response<LoginAdminResponse | ErrorResponse>
) => {
  try {
    const loginResult = await authService.loginAdmin(request.body);

    if (!loginResult) return;

    response.cookie("refreshToken", loginResult.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const responseData: LoginAdminResponse = {
      userData: {
        _id: loginResult.userData._id,
        username: loginResult.userData.username,
        email: loginResult.userData.email,
        roles: loginResult.userData.roles,
      },
      accessToken: loginResult.accessToken,
    };

    response.json(responseData);
  } catch (error) {
    handleError(error, response);
  }
};

export const refreshToken = async (
  request: Request,
  response: Response<RefreshTokenResponse | ErrorResponse>
) => {
  try {
    const cookies = request.cookies;

    const refreshTokenFromCookie = cookies?.refreshToken;

    if (!refreshTokenFromCookie) {
      return response.sendStatus(401);
    }

    const result = await authService.refreshTokenService(
      refreshTokenFromCookie
    );
    return response.json(result);
  } catch (error) {
    handleError(error, response);
  }
};

export const logoutAdmin = async (request: Request, response: Response) => {
  try {
    const cookies = request.cookies;

    if (!cookies?.refreshToken) return response.sendStatus(204);
    const refreshTokenFromCookie = cookies?.refreshToken;

    const admin = await authService.logoutAdmin(refreshTokenFromCookie);

    if (!admin) {
      response.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return response.sendStatus(204);
    }

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.sendStatus(204);
  } catch (error) {
    handleError(error, response);
  }
};
