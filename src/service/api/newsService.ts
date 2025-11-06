import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import News, { INews } from "../../model/News";
import { CreateNewsRequest, UpdateNewsRequest } from "../../types/api/api-types";
import { PaginatedResponse } from "../../types";

export const getPaginatedNews = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<INews>> => {
  if (page < 1 || limit < 1) {
    throw new CustomError(400, "Page and limit must be a positive integers.");
  }
  const skip = (page - 1) * limit;

  const totalItems = await News.countDocuments();
  const data = await News.find()
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

export const createNews = async (
  newsDetails: CreateNewsRequest
): Promise<INews> => {
  const { title, description, dateTime, location, category, priority } =
    newsDetails;

  if (
    !title ||
    !description ||
    !dateTime ||
    !location ||
    !category ||
    !priority
  ) {
    throw new CustomError(400, "All Fields Are Required!");
  }

  const existingNews = await News.findOne({ title });
  if (existingNews)
    throw new CustomError(409, `News already exists with Title: ${title}`);

  const priorities = ["LOW", "MEDIUM", "HIGH"];
  if (!priorities.includes(priority)) {
    throw new CustomError(
      400,
      "Invalid Priority! Should be: LOW, MEDIUM or HIGH only!"
    );
  }

  return await News.create(newsDetails);
};

export const updateNews = async (
  id: string,
  newsDetails: UpdateNewsRequest
): Promise<INews> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError(400, "Invalid News ID!");
  }

  const existingNews = await News.findById(id);
  if (!existingNews) {
    throw new CustomError(404, `News not found with ID: ${id}`);
  }

  const { title, description, dateTime, location, category, priority } =
    newsDetails;

  if (title && title !== existingNews.title) {
    const existingTitle = await News.findOne({
      title: title,
      _id: { $ne: id },
    });

    if (existingTitle) {
      throw new CustomError(409, `News already exists with Title: ${title}`);
    }
  }

  const fieldsToUpdate: Record<string, any> = {};

  if (title) fieldsToUpdate.title = title;
  if (description) fieldsToUpdate.description = description;
  if (dateTime) fieldsToUpdate.dateTime = dateTime;
  if (location) fieldsToUpdate.location = location;
  if (category) fieldsToUpdate.category = category;
  if (priority) fieldsToUpdate.priority = priority;

  const updatedNews = await News.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedNews) {
    throw new CustomError(500, `Unexpected error: News update failed for ID ${id}.)`)
  }

  return updatedNews;
};

export const deleteNews = async (id: string): Promise<INews> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError(400, "Invalid News ID!");
  }

  const deletedNews = await News.findByIdAndDelete(id);
  if (!deletedNews) throw new CustomError(404, `News not found with ID ${id}.)`);

  return deletedNews;
};
