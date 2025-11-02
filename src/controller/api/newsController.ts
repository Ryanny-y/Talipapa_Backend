import { INews } from '../../model/News';
import * as newsService from '../../service/api/newsService';
import { Request, Response } from "express";
import { handleError } from '../../utils/errorResponseHandler';
import { ErrorResponse } from '../../types';
import { CreateNewsRequest, NewsQuery } from '../../types/api/news/request';
import { CreateNewsResponse, PaginatedResponse } from '../../types/api/news/response';

export const getPaginatedNews = async (request: Request<{}, {}, {}, NewsQuery>, response: Response<PaginatedResponse<INews> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedResponse<INews> = await newsService.getPaginatedNews(page, limit);
    
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