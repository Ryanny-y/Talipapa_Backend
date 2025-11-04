import Material from "../../model/Material";
import { PaginatedMaterialResponse } from "../../types/api/material/response";

export const getPaginatedMaterials = async (page: number, limit: number): Promise<PaginatedMaterialResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Material.countDocuments();
  const data = await Material.find()
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
