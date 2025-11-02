import { INews } from "../../../model/News";

interface PaginatedResponse<T> {
  page: number;
  limit: number;
  data: T[],
  totalItems: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  nextPage: number | null;
  prevPage: number | null;
}

export interface CreateNewsResponse {
  message: string;
  data: INews
}