import { Request, Response } from "express";
import * as staffService from '../../service/api/staffService';
import { handleError } from "../../utils/errorResponseHandler";
import { ApiResponse } from "../../types/api/api-types";
import { IStaff } from "../../model/Staff";

export const getStaffByFarm = async (request: Request<{ id: string }>, response: Response<ApiResponse<IStaff[]>>) => {
  try {
    const { id } = request.params;
    const staffs = await staffService.getStaffByFarm(id);
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