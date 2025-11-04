import { Request, Response } from "express";
import * as materialService from '../../service/api/materialService'
import { handleError } from "../../utils/errorResponseHandler"
import { ErrorResponse, PaginationRequestQuery } from "../../types";
import { CreateMaterialResponse, PaginatedMaterialResponse, UpdateMaterialResponse } from "../../types/api/material/response";
import { IMaterial } from "../../model/Material";
import { CreateMaterialRequest, UpdateMaterialRequest } from "../../types/api/material/request";

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

export const createMaterial = async (request: Request<{}, {}, CreateMaterialRequest>, response: Response<CreateMaterialResponse | ErrorResponse>) => {
  try {
    const materialImage = request.file;
    const createdMaterial: IMaterial = await materialService.createMaterial(request.body, materialImage);
    const responsePayload: CreateMaterialResponse = {
      message: `Material ${createdMaterial.name} created successfully.`,
      data: createdMaterial
    }
    
    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
};

export const updateMaterial = async (request: Request<{ id: string }, {}, UpdateMaterialRequest>, response: Response<UpdateMaterialResponse | ErrorResponse>) => {
  try {
    const { id } = request.params;
    const materialImage = request.file;
    const updatedMaterial: IMaterial = await materialService.updateMaterial(id, request.body, materialImage);
    const payloadResponse: UpdateMaterialResponse = {
      message: `Material ${updatedMaterial.name} updated successfully.`,
      data: updatedMaterial
    };

    response.json(payloadResponse)
  } catch (error) {
    handleError(error, response);
  }
}