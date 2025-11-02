import { INews } from '../../model/News';
import * as newsService from '../../service/api/newsService';
import { Request, Response } from "express";
import { handleError } from '../../utils/errorResponseHandler';
import { ErrorResponse } from '../../types';

export const getPaginatedNews = async (request: Request, response: Response<PaginatedResponse<INews> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedResponse<INews> = await newsService.getPaginatedNews(page, limit);
    
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }

} 