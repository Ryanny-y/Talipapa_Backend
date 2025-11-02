import { INews } from '../../model/News';
import * as newsService from '../../service/api/newsService';
import { Request, Response } from "express";
import { handleError } from '../../utils/errorResponseHandler';
import { ErrorResponse } from '../../types';
import { CreateNewsRequest, NewsQuery, UpdateNewsRequest } from '../../types/api/news/request';
import { CreateNewsResponse, PaginatedNewsResponse, UpdateNewsResponse } from '../../types/api/news/response';
import { CustomError } from '../../error/CustomError';

export const getPaginatedNews = async (request: Request<{}, {}, {}, NewsQuery>, response: Response<PaginatedNewsResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedNewsResponse = await newsService.getPaginatedNews(page, limit);
    
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createNews = async (request: Request<{}, {}, CreateNewsRequest>, response: Response<CreateNewsResponse | ErrorResponse>) => {
  try {
    const createdNews: INews = await newsService.createNews(request.body);
    const responsePayload: CreateNewsResponse = {
      message: 'News Created',
      data: createdNews
    }

    response.status(201).json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}

export const updateNews = async (request: Request<{ id: string }, {}, UpdateNewsRequest >, response: Response<UpdateNewsResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    if(!id) {
      throw new CustomError(400, "ID is required to update news!");
    }
    const updatedNews: INews = await newsService.updateNews(id, request.body);
    const responsePayload: UpdateNewsResponse = {
      message: `News ${updatedNews.title} Updated`,
      data: updatedNews
    }

    return response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}