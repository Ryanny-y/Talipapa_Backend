import { PaginatedResponse } from "../../index";
import { IOfficial } from "../../../model/Official";

export interface OfficialResponse {
  message: string;
  data: IOfficial;
}

export type CreateOfficialResponse = OfficialResponse;
export type UpdateOfficialResponse = OfficialResponse;
export type DeleteOfficialResponse = { message : string };