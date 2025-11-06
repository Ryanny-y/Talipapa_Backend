import { INews } from '../../model/News';
import * as newsService from '../../service/api/newsService';
import { Request, Response } from "express";
import { handleError } from '../../utils/errorResponseHandler';
import { ErrorResponse, PaginatedResponse, PaginationRequestQuery } from '../../types';
import { ApiResponse, CreateNewsRequest, UpdateNewsRequest } from '../../types/api/api-types';
import { CustomError } from '../../error/CustomError';

export const getPaginatedNews = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedResponse<INews> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedResponse<INews> = await newsService.getPaginatedNews(page, limit);
    
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createNews = async (request: Request<{}, {}, CreateNewsRequest>, response: Response<ApiResponse<INews>>) => {
  try {
    const createdNews: INews = await newsService.createNews(request.body);
    const responsePayload: ApiResponse<INews> = {
      success: true,
      message: 'News Created',
      data: createdNews
    }

    response.status(201).json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}

export const updateNews = async (request: Request<{ id: string }, {}, UpdateNewsRequest >, response: Response<ApiResponse<INews>>) => {
  try {
    const { id } = request.params;
    if(!id) throw new CustomError(400, "ID is required to update news!");

    const updatedNews: INews = await newsService.updateNews(id, request.body);
    const responsePayload: ApiResponse<INews> = {
      success: true,
      message: `News ${updatedNews.title} Updated`,
      data: updatedNews
    }

    return response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteNews = async (request: Request<{ id: string }>, response: Response<ApiResponse<INews>>) => {
  try {
    const { id } = request.params;
    
    const deletedNews: INews = await newsService.deleteNews(id);
    const responsePayload: ApiResponse<INews> = {
      success: true,
      message: `News "${deletedNews.title}" deleted successfully!`,
      data: deletedNews
    };
    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}