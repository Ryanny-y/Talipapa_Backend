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
  adminData: AdminResponse;
  accessToken: string;
}

export interface RefreshTokenResponse {
  adminData: AdminResponse,
  accessToken: string
}