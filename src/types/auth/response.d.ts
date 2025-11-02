import { Roles } from "../../model/Admin";

export interface AdminResponse {
  _id: string;
  username: string;
  contactNumber?: string;
  email?: email;
  roles: Roles[];
}

export interface CreateAdminResponse {
  message: string;
  admin: AdminResponse
}

export interface LoginAdminResponse {
  userData: AdminResponse;
  accessToken: string;
}

export interface RefreshTokenResponse {
  userData: AdminResponse,
  accessToken: string
}