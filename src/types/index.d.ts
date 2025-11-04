export enum Roles {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface PaginationRequestQuery {
  page?: string;
  limit?: string
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  data: T[];
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ErrorResponse {
  success: false,
  error: string,
  message: string,
  statusCode: number,
  timestamp?: string,
}

export interface ImageInterface {
  url: string,
  key: string,
  originalName: string,
  size: Number,
  mimetype: string,
}