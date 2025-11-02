import { CustomError } from "../../error/CustomError";
import News, { INews } from "../../model/News";
import { CreateNewsRequest } from "../../types/api/news/request";
import { PaginatedResponse } from "../../types/api/news/response";

export const getPaginatedNews = async (page: number, limit: number) : Promise<PaginatedResponse<INews>> => {
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