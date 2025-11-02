import { PaginatedResponse } from "../../index";
import { INews } from "../../../model/News";

export interface NewsResponse {
  message: string;
  data: INews;
}

export type PaginatedNewsResponse = PaginatedResponse<INews>;
export type CreateNewsResponse = NewsResponse;
export type UpdateNewsResponse = NewsResponse;
export type DeleteNewsResponse = { message : string };