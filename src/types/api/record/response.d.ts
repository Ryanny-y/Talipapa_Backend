import { PaginatedResponse } from "../..";
import { IRecord } from "../../../model/Record";

interface RecordResponse {
  message: string;
  data: IRecord
}

export type PaginatedRecordResponse = PaginatedResponse<IRecord>;
export type CreateRecordResponse = RecordResponse
export type UpdateRecordResponse = RecordResponse