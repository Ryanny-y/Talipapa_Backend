import Record, { IRecord } from "../../model/Record";
import { PaginatedRecordResponse } from "../../types/api/record/response";

export const getPaginatedRecords = async (page: number, limit: number): Promise<PaginatedRecordResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Record.countDocuments();
  const data = await Record.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IRecord[]>();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  }
}