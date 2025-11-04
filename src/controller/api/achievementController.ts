import * as achievementService from '../../service/api/achievementService';
import { Request, Response } from "express";
import { ErrorResponse, PaginationRequestQuery } from '../../types';
import { handleError } from '../../utils/errorResponseHandler';
import { CreateAchievementResponse, PaginatedAchievementResponse } from '../../types/api/achievement/response';
import { CreateAchievementRequest } from '../../types/api/achievement/request';

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

export const createAchievement = async (request: Request<{}, {}, CreateAchievementRequest>, response: Response<CreateAchievementResponse | ErrorResponse>) => {
  try {
    const imageFile = request.file;
    const createdAchievement = await achievementService.createAchievement(request.body, imageFile);
    const responsePayload: CreateAchievementResponse = {
      message: `Achievement ${createdAchievement.title}`,
      data: createdAchievement
    };

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
};