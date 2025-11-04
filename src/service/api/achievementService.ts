import { CustomError } from "../../error/CustomError";
import Achievement, { IAchievement } from "../../model/Achievement";
import { CreateAchievementRequest } from "../../types/api/achievement/request";
import { PaginatedAchievementResponse } from "../../types/api/achievement/response";
import { MulterS3File } from "../../types/express";

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

export const createAchievement = async (achievementDetails: CreateAchievementRequest, image: MulterS3File | undefined): Promise<IAchievement> => {
  const { title, description, link } = achievementDetails;
  
  if(!title || !description) throw new CustomError(400, "Title and Description is required!");

  if(!image) throw new CustomError(400, "Achievement Photo is required!");

  const existingAchievement = await Achievement.findOne({ title });
  if(existingAchievement) throw new CustomError(409, "Achievment already exists");

  const createdAchievement = await Achievement.create({
    title,
    description,
    link,
    image: {
      url: image.location,
      key: image.key,
      originalName: image.originalname,
      size: image.size,
      mimetype: image.mimetype
    }
  });

  return createdAchievement;
}