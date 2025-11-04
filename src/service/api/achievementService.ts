import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Achievement, { IAchievement } from "../../model/Achievement";
import { CreateAchievementRequest, UpdateAchievementRequest } from "../../types/api/achievement/request";
import { PaginatedAchievementResponse } from "../../types/api/achievement/response";
import { MulterS3File } from "../../types/express";
import deleteFromS3 from "../../utils/deleteFromS3";

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
  if(existingAchievement) throw new CustomError(409, "Achievement already exists");

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

export const updateAchievement = async (id: string, achievementDetails: UpdateAchievementRequest, image: MulterS3File | undefined): Promise<IAchievement> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, "Achievement ID is invalid!");
  
  const existingAchievement = await Achievement.findById(id);
  if(!existingAchievement) throw new CustomError(404, `Achievement not found with ID: ${id}`);

  const { title, description, link } = achievementDetails;
  if(title && title !== existingAchievement.title) {
    const existingTitle = await Achievement.findOne({
      title,
      _id: { $ne: id }
    }).lean();

    if(existingTitle) {
      throw new CustomError(409, `Achievement with title ${title} already exists`);
    }
  }

  const fieldsToUpdate: Record<string, any> = {}; 
  if(title) fieldsToUpdate.title = title;
  if(description) fieldsToUpdate.description = description;
  if(link) fieldsToUpdate.link = link;

  if(image) {
    if(existingAchievement.image && existingAchievement.image.key) {
      await deleteFromS3(image.key);
    }

    fieldsToUpdate.image = {
      url: image.location,
      key: image.key,
      originalName: image.originalname,
      size: image.size,
      mimetype: image.mimetype,
    }
  }
  
  const updatedAchievement: IAchievement | null = await Achievement.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
  if(!updatedAchievement) throw new CustomError(404, `Achievement not found after update (ID: ${id})`);

  return updatedAchievement;
}

export const deleteAchievement = async (id: string): Promise<IAchievement> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Achievement ID: ${id} is invalid`);
  const deletedAchievement: IAchievement | null = await Achievement.findByIdAndDelete(id);
  if (!deletedAchievement) throw new CustomError(404, `Achievement not found (ID: ${id})`);

  if(deletedAchievement.image?.key) {
    await deleteFromS3(deletedAchievement.image.key);
  }

  return deletedAchievement;
}