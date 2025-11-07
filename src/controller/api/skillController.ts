import { Request, Response } from 'express';
import * as skillService from '../../service/api/skillService';
import { ErrorResponse } from '../../types';
import { handleError } from "../../utils/errorResponseHandler"
import { ISkill } from '../../model/Skill';
import { ApiResponse, CreateSkillRequest } from '../../types/api/api-types';

export const getAllSkills = async (request: Request, response: Response<ISkill[] | ErrorResponse>) => {
  try {
    const result = await skillService.getAllSkills();
    response.json(result);
  } catch (error) {
    handleError(error, response);
  }
}

export const createSkill = async (request: Request<{}, {}, CreateSkillRequest>, response: Response<ApiResponse<ISkill>>) => {
  try {
    console.log(request.body);
  
    const createdOfficial = await skillService.createSkill(request.body);
    const responsePayload: ApiResponse<ISkill> = {
      success: true,
      message: `Skill ${createdOfficial.name} added successfully.`,
      data: createdOfficial
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

// export const updateOfficial = async (request: Request<{ id: string }, {}, UpdateOfficialRequest>, response: Response<ApiResponse<IOfficial>>) => {
//   try {
//     const { id } = request.params;
//     const officialImage = request.file;
//     const updatedOfficial = await skillService.updateOfficial(id, request.body, officialImage);
//     const responsePayload: ApiResponse<IOfficial> = {
//       success: true,
//       message: `Official ${updatedOfficial.name} updated successfully.`,
//       data: updatedOfficial
//     }

//     response.json(responsePayload);
//   } catch (error) {
//     handleError(error, response);
//   }
// }

// export const deleteOfficial = async (request: Request<{ id: string }>, response: Response<ApiResponse<IOfficial>>) => {
//   try {
//     const { id } = request.params;
//     const deletedOfficial: IOfficial = await skillService.deleteOfficial(id);
//     const responsePayload: ApiResponse<IOfficial> = {
//       success: true,
//       message: `Official ${deletedOfficial.name} deleted successfully.`,
//       data: deletedOfficial
//     }

//     response.json(responsePayload);
//   } catch (error) {
//     handleError(error, response);
//   }
// }