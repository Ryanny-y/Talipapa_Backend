import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import News, { INews } from "../../model/News";
import { CreateNewsRequest, UpdateNewsRequest } from "../../types/api/news/request";
import { PaginatedNewsResponse } from "../../types/api/news/response";

export const getPaginatedNews = async (page: number, limit: number) : Promise<PaginatedNewsResponse> => {
  const skip = (page - 1) * limit;

  const totalItems: number = await News.countDocuments();
  const data: INews[] = await News.find().skip(skip).limit(limit);

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  }
};

export const createNews = async (newsDetails: CreateNewsRequest) : Promise<INews> => {
  try {
    const { title, description, dateTime, location, category, priority } = newsDetails;

    if(!title || !description || !dateTime || !location || !category || !priority) {
      throw new CustomError(400, "All Fields Are Required!");
    }

    const existingNews = await News.findOne({ title });
    if(existingNews) throw new CustomError(409, `News already exists with Title: ${title}`);

    const priorities = ["LOW", "MEDIUM", "HIGH"];
    if(!priorities.includes(priority)) {
      throw new CustomError(400, 'Invallid Priority! Should be: LOW, MEDIUM or HIGH only!')
    }

    const createdNews = await News.create({
      title,
      description,
      dateTime,
      location,
      category,
      priority
    });

    return createdNews;
  } catch (error) {
    throw error;
  }
}

export const updateNews = async (id: string, newsDetails: UpdateNewsRequest ) : Promise<INews> => {
  try {
    const { title } = newsDetails;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(400, "Invalid News ID!");
    }

    const existingNews = await News.findById(id);
    if(!existingNews) {
      throw new CustomError(404, `News not found with ID: ${id}`);
    }

    if(title && title !== existingNews.title) {
      const existingName = await News.findOne({
        title,
        id: { $ne: id }
      });
      if(existingName) throw new CustomError(409, `News already exists with Title: ${title}`);
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      newsDetails,
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      throw new CustomError(404, `News not found after update (ID: ${id})`);
    }
    
    return updatedNews;
  } catch (error) {
    throw error;
  }
}