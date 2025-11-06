import { Request, Response } from "express";
import * as materialService from '../../service/api/materialService'
import { handleError } from "../../utils/errorResponseHandler"
import { ErrorResponse, PaginatedResponse, PaginationRequestQuery } from "../../types";
import { IMaterial } from "../../model/Material";
import { ApiResponse, CreateMaterialRequest, UpdateMaterialRequest } from "../../types/api/api-types";

export const getPaginatedMaterials = async (request: Request<{}, {}, {}, PaginationRequestQuery>, response: Response<PaginatedResponse<IMaterial> | ErrorResponse>) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result: PaginatedResponse<IMaterial> = await materialService.getPaginatedMaterials(page, limit);
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createMaterial = async (request: Request<{}, {}, CreateMaterialRequest>, response: Response<ApiResponse<IMaterial>>) => {
  try {
    const materialImage = request.file;
    const createdMaterial: IMaterial = await materialService.createMaterial(request.body, materialImage);
    const responsePayload: ApiResponse<IMaterial> = {
      success: true,
      message: `Material ${createdMaterial.name} created successfully.`,
      data: createdMaterial
    }
    
    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
};

export const updateMaterial = async (request: Request<{ id: string }, {}, UpdateMaterialRequest>, response: Response<ApiResponse<IMaterial>>) => {
  try {
    const { id } = request.params;
    const materialImage = request.file;
    const updatedMaterial: IMaterial = await materialService.updateMaterial(id, request.body, materialImage);
    const responsePayload: ApiResponse<IMaterial> = {
      success: true,
      message: `Material ${updatedMaterial.name} updated successfully.`,
      data: updatedMaterial
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteMaterial = async (request: Request<{ id: string }>, response: Response<ApiResponse<IMaterial>>) => {
  try {
    const { id } = request.params;
    const deletedProduct: IMaterial = await materialService.deleteMaterial(id);
    const responsePayload: ApiResponse<IMaterial> = {
      success: true,
      message: `Material ${deletedProduct.name} deleted successfully!`,
      data: deletedProduct  
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}