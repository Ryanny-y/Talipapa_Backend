import * as farmService from "../../service/api/farmService";
import { Request, Response } from "express";
import { handleError } from "../../utils/errorResponseHandler"
import { ApiResponse, CreateFarmRequest, UpdateFarmRequest } from "../../types/api/api-types";
import { IFarm } from "../../model/Farm";

export const getFarm = async (request: Request, response: Response<ApiResponse<IFarm[]>>) => {
  try {
    const result = await farmService.getFarm();
    const responsePayload: ApiResponse<IFarm[]> = {
      success: true,
      data: result,
    };

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const createFarm = async (request: Request<{}, {}, CreateFarmRequest>, response: Response<ApiResponse<IFarm>>) => {
  try {
    const farmImage = request.file;
    const createdFarm = await farmService.createFarm(request.body, farmImage);
    const responsePayload: ApiResponse<IFarm> = {
      success: true,
      message: `Farm ${createdFarm.name} created successfully`,
      data: createdFarm,
    };

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

  export const updateFarm = async (request: Request<{ id: string }, {}, UpdateFarmRequest>, response: Response<ApiResponse<IFarm>>) => {
    try {
      const { id } = request.params;
      const farmImage = request.file;
      const updatedFarm = await farmService.updateFarm(id, request.body, farmImage);
      const responsePayload: ApiResponse<IFarm> = {
        success: true,
        message: `Farm ${updatedFarm.name} updated successfully`,
        data: updatedFarm,
      };

      response.json(responsePayload);
    } catch (error) {
      handleError(error, response);
    }
  } 