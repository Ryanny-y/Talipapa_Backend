import { Request, Response } from 'express';
import { IOfficial } from '../../model/Official';
import * as officialService from '../../service/api/officialService';
import { ErrorResponse } from '../../types';
import { handleError } from "../../utils/errorResponseHandler"

export const getAllOfficials = async (request: Request, response: Response<IOfficial[] | ErrorResponse>) => {
  try {
    const result = await officialService.getAllOfficials();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}