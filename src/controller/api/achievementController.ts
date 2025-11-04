import * as achievementService from '../../service/api/achievementService';
import { Request, Response } from "express";
import { ErrorResponse, PaginationRequestQuery } from '../../types';
import { handleError } from '../../utils/errorResponseHandler';
import { CreateAchievementResponse, DeleteAchievementResponse, PaginatedAchievementResponse, UpdateAchievementResponse } from '../../types/api/achievement/response';
import { CreateAchievementRequest, UpdateAchievementRequest } from '../../types/api/achievement/request';
import { IAchievement } from '../../model/Achievement';

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

export const updateAchievement = async (request: Request<{ id: string }, {}, UpdateAchievementRequest>, response: Response<UpdateAchievementResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const imageFile = request.file;
    const updatedAchievement = await achievementService.updateAchievement(id, request.body, imageFile);
    const responsePayload: UpdateAchievementResponse = {
      message: `Achievement Updated Successfully`,
      data: updatedAchievement
    }
    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteAchievement = async (request: Request<{ id: string}>, response: Response<DeleteAchievementResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const deletedAchievement: IAchievement = await achievementService.deleteAchievement(id);
  
    response.json({ message: `Achievement ${deletedAchievement.title} deleted successfully!`});
  } catch (error) {
    handleError(error, response);
  }
}