import Guideline from "../../model/Guideline";
import { PaginatedGuidelineResponse } from "../../types/api/guideline/request";

export const getPaginatedGuidelines = async (page: number, limit: number): Promise<PaginatedGuidelineResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Guideline.countDocuments();
  const data = await Guideline.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
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
};