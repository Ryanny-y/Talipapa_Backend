import { Request, Response } from "express";
import * as guidelineService from '../../service/api/guidelineService';
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { handleError } from "../../utils/errorResponseHandler";
import { CreateGuidelineResponse, PaginatedGuidelineResponse } from "../../types/api/guideline/response";
import { CreateGuidelineRequest } from "../../types/api/guideline/request";

export const getPaginatedGuidelines = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedGuidelineResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 20;

    const result = await guidelineService.getPaginatedGuidelines(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response)
  }
}

export const createGuidelines = async (request: Request<{}, {}, CreateGuidelineRequest>, response: Response<CreateGuidelineResponse | ErrorResponse>) => {
  try {
    const createdGuideline = await guidelineService.createGuidelines(request.body);
    const responsePayload = {
      message: `Guideline ${createdGuideline.title} created successfully.`,
      data: createdGuideline
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}