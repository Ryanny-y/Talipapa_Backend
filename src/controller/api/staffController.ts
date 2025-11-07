import { Request, Response } from "express";
import * as staffService from '../../service/api/staffService';
import { handleError } from "../../utils/errorResponseHandler";
import { AddStaffRequest, ApiResponse, UpdateStaffRequest } from "../../types/api/api-types";
import { IStaff } from "../../model/Staff";

export const getStaffByFarm = async (request: Request<{ farmId: string }>, response: Response<ApiResponse<IStaff[]>>) => {
  try {
    const { farmId } = request.params;
    const staffs = await staffService.getStaffByFarm(farmId);
    const responsePayload: ApiResponse<IStaff[]> = {
      success: true,
      message: `Staff members retrieved successfully.`,
      data: staffs
    }
    
    response.json(responsePayload);
  } catch (error) {
    handleError(error, response)
  }
}

export const addStaffToFarm = async (request: Request<{}, {}, AddStaffRequest>, response: Response<ApiResponse<IStaff>>) => {
  try {
    const newStaff = await staffService.addStaffToFarm(request.body);
    const responsePayload: ApiResponse<IStaff> = {
      success: true,
      message: `Staff member ${newStaff.name} added successfully.`,
      data: newStaff
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response)
  }
}

export const updateStaff = async (request: Request<{ id: string }, {}, UpdateStaffRequest>, response: Response<ApiResponse<IStaff>>) => {
  try {
    const { id } = request.params;
    const updatedStaff = await staffService.updateStaff(id, request.body);
    const responsePayload: ApiResponse<IStaff> = {
      success: true,
      message: `Staff member ${updatedStaff.name} updated successfully.`,
      data: updatedStaff
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);    
  }
}

export const deleteStaff = async (request: Request<{ id: string }>, response: Response<ApiResponse<IStaff>>) => {
  try {
    const { id } = request.params;
    const deletedStaff = await staffService.deleteStaff(id);
    const responsePayload: ApiResponse<IStaff> = {
      success: true,
      message: `Staff member ${deletedStaff.name} deleted successfully.`,
      data: deletedStaff
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}