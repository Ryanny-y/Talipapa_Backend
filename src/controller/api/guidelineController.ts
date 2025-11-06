import { Request, Response } from "express";
import * as guidelineService from '../../service/api/guidelineService';
import { ErrorResponse, PaginatedResponse, PaginationRequestQuery } from "../../types";
import { handleError } from "../../utils/errorResponseHandler";
import { IGuideline } from "../../model/Guideline";
import { ApiResponse, CreateGuidelineRequest, UpdateGuidelineRequest } from "../../types/api/api-types";

export const getPaginatedGuidelines = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedResponse<IGuideline> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 20;

    const result = await guidelineService.getPaginatedGuidelines(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response)
  }
}

export const createGuidelines = async (request: Request<{}, {}, CreateGuidelineRequest>, response: Response<ApiResponse<IGuideline>>) => {
  try {
    const createdGuideline = await guidelineService.createGuidelines(request.body);
    const responsePayload: ApiResponse<IGuideline> = {
      success: true,
      message: `Guideline ${createdGuideline.title} created successfully.`,
      data: createdGuideline
    }

    response.status(201).json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}

export const updateGuideline = async (request: Request<{ id: string }, {}, UpdateGuidelineRequest>, response: Response<ApiResponse<IGuideline>>) => {
  try {
    const { id } = request.params;
    const updatedGuideline = await guidelineService.updateGuideline(id, request.body);
    const responsePayload: ApiResponse<IGuideline> = {
      success: true,
      message: `Guideline ${updatedGuideline.title} updated successfully.`,
      data: updatedGuideline
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteGuideline = async (request: Request<{ id: string}>, response: Response<ApiResponse<IGuideline>>) => {
  try {
    const { id } = request.params;
    const deletedAchievement = await guidelineService.deleteGuideline(id);
    const responsePayload: ApiResponse<IGuideline> = {
      success: true,
      message: `Guideline ${deletedAchievement.title} deleted successfully.`,
      data: deletedAchievement
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}