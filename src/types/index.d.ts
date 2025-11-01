export enum Roles {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface ErrorResponse {
  success: false,
  error: string,
  message: string,
  statusCode: number,
  timestamp?: string,
  details?: any
}