import * as achievementService from '../../service/api/achievementService';
import { Request, Response } from "express";
import { ErrorResponse, PaginatedResponse, PaginationRequestQuery } from '../../types';
import { handleError } from '../../utils/errorResponseHandler';
import { IAchievement } from '../../model/Achievement';
import { MulterS3File } from '../../types/express';
import { ApiResponse, CreateAchievementRequest, UpdateAchievementRequest } from '../../types/api/api-types';

export const getPaginatedAchievements = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedResponse<IAchievement> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const result: PaginatedResponse<IAchievement> = await achievementService.getPaginatedAchievements(page, limit);

    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
};

export const createAchievement = async (request: Request<{}, {}, CreateAchievementRequest>, response: Response<ApiResponse<IAchievement>>) => {
  try {
    const imageFile = request.file;
    const createdAchievement = await achievementService.createAchievement(request.body, imageFile);
    const responsePayload: ApiResponse<IAchievement> = {
      success: true,
      data: createdAchievement,
      message: `Achievement ${createdAchievement.title} created successfully!`,
    };

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
};

export const updateAchievement = async (request: Request<{ id: string }, {}, UpdateAchievementRequest>, response: Response<ApiResponse<IAchievement>>) => {
  try {
    const { id } = request.params;
    const imageFile = request.file;
    const updatedAchievement = await achievementService.updateAchievement(id, request.body, imageFile);
    const responsePayload: ApiResponse<IAchievement> = {
      success: true,
      message: `Achievement Updated Successfully`,
      data: updatedAchievement
    }
    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteAchievement = async (request: Request<{ id: string}>, response: Response<ApiResponse<IAchievement>>) => {
  try {
    const { id } = request.params;
    const deletedAchievement: IAchievement = await achievementService.deleteAchievement(id);
    const responsePayload: ApiResponse<IAchievement> = {
      success: true,
      message: `Achievement ${deletedAchievement.title} deleted successfully!`,
      data: deletedAchievement
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}