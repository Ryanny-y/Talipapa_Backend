import { Roles } from "../../model/Admin";

export interface AdminResponse {
  _id?: string,
  username: string,
  email: email,
  roles: Roles[],
}

export interface createAdminResponse {
  message: string;
  admin: AdminResponse
}
