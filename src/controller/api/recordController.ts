import * as recordService from '../../service/api/recordService';
import { Request, Response } from "express";
import { ErrorResponse, PaginationRequestQuery } from '../../types';
import { PaginatedRecordResponse } from '../../types/api/record/response';
import { handleError } from '../../utils/errorResponseHandler';

export const getPaginatedRecords = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedRecordResponse | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result = await recordService.getPaginatedRecords(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
};
