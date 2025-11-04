import { Request, Response } from "express";
import * as materialService from '../../service/api/materialService'
import { handleError } from "../../utils/errorResponseHandler"
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { PaginatedMaterialResponse } from "../../types/api/material/response";

export const getPaginatedMaterials = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedMaterialResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result: PaginatedMaterialResponse = await materialService.getPaginatedMaterials(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}