import { CustomError } from "../../error/CustomError";
import Achievement, { IAchievement } from "../../model/Achievement";
import { PaginatedAchievementResponse } from "../../types/api/achievement/response";

export const getPaginatedAchievements = async (
  page: number,
  limit: number
): Promise<PaginatedAchievementResponse> => {
  if (page < 1 || limit < 1) {
    throw new CustomError(400, "Page and limit must be a positive integers.");
  }

  const skip = (page - 1) * limit;

  const totalItems = await Achievement.countDocuments();
  const data: IAchievement[] = await Achievement.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

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
  };
};
