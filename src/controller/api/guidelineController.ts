import { Request, Response } from "express";
import * as guidelineService from '../../service/api/guidelineService';
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { PaginatedGuidelineResponse } from "../../types/api/guideline/request";
import { handleError } from "../../utils/errorResponseHandler";

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