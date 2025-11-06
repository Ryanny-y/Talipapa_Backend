import { Request, Response } from 'express';
import { IOfficial } from '../../model/Official';
import * as officialService from '../../service/api/officialService';
import { ErrorResponse } from '../../types';
import { handleError } from "../../utils/errorResponseHandler"
import { CreateOfficialResponse, UpdateOfficialResponse } from '../../types/api/official/response';
import { CreateOfficialRequest, UpdateOfficiaiRequest } from '../../types/api/official/request';

export const getAllOfficials = async (request: Request, response: Response<IOfficial[] | ErrorResponse>) => {
  try {
    const result = await officialService.getAllOfficials();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createOfficial = async (request: Request<{}, {}, CreateOfficialRequest>, response: Response<CreateOfficialResponse | ErrorResponse>) => {
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

export const updateOfficial = async (request: Request<{ id: string }, {}, UpdateOfficiaiRequest>, response: Response<UpdateOfficialResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const officialImage = request.file;
    const createdOffial = await officialService.updateOfficial(id, request.body, officialImage);
    const responsePayload = {
      message: `Official ${createdOffial.name} updated successfully.`,
      data: createdOffial
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}
