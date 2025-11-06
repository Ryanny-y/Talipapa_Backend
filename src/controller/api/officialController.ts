import { Request, Response } from 'express';
import { IOfficial } from '../../model/Official';
import * as officialService from '../../service/api/officialService';
import { ErrorResponse } from '../../types';
import { handleError } from "../../utils/errorResponseHandler"
import { ApiResponse, CreateOfficialRequest, UpdateOfficialRequest } from '../../types/api/api-types';

export const getAllOfficials = async (request: Request, response: Response<IOfficial[] | ErrorResponse>) => {
  try {
    const result = await officialService.getAllOfficials();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createOfficial = async (request: Request<{}, {}, CreateOfficialRequest>, response: Response<ApiResponse<IOfficial>>) => {
  try {
    const officialImage = request.file;
    const createdOfficial = await officialService.createOfficial(request.body, officialImage);
    const responsePayload: ApiResponse<IOfficial> = {
      success: true,
      message: `Official ${createdOfficial.name} added successfully.`,
      data: createdOfficial
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const updateOfficial = async (request: Request<{ id: string }, {}, UpdateOfficialRequest>, response: Response<ApiResponse<IOfficial>>) => {
  try {
    const { id } = request.params;
    const officialImage = request.file;
    const updatedOfficial = await officialService.updateOfficial(id, request.body, officialImage);
    const responsePayload: ApiResponse<IOfficial> = {
      success: true,
      message: `Official ${updatedOfficial.name} updated successfully.`,
      data: updatedOfficial
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteOfficial = async (request: Request<{ id: string }>, response: Response<ApiResponse<IOfficial>>) => {
  try {
    const { id } = request.params;
    const deletedOfficial: IOfficial = await officialService.deleteOfficial(id);
    const responsePayload: ApiResponse<IOfficial> = {
      success: true,
      message: `Official ${deletedOfficial.name} deleted successfully.`,
      data: deletedOfficial
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}