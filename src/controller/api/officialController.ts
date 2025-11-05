import { Request, Response } from 'express';
import { IOfficial } from '../../model/Official';
import * as officialService from '../../service/api/officialService';
import { ErrorResponse } from '../../types';
import { handleError } from "../../utils/errorResponseHandler"
import { CreateOfficialResponse } from '../../types/api/official/response';

export const getAllOfficials = async (request: Request, response: Response<IOfficial[] | ErrorResponse>) => {
  try {
    const result = await officialService.getAllOfficials();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createOfficial = async (request: Request, response: Response<CreateOfficialResponse | ErrorResponse>) => {
  try {
    const officialImage = request.file;
    const createdOffial = await officialService.createOfficial(request.body, officialImage);
    const responsePayload = {
      message: `Official ${createdOffial.name} added successfully.`,
      data: createdOffial
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}