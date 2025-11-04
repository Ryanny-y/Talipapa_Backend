import * as achievementService from '../../service/api/achievementService';
import { Request, Response } from "express";
import { ErrorResponse, PaginationRequestQuery } from '../../types';
import { handleError } from '../../utils/errorResponseHandler';
import { PaginatedAchievementResponse } from '../../types/api/achievement/response';

export const getPaginatedAchievements = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedAchievementResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedAchievementResponse = await achievementService.getPaginatedAchievements(page, limit);

    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
};