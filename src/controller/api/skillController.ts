import { Request, Response } from 'express';
import * as skillService from '../../service/api/skillService';
import { handleError } from "../../utils/errorResponseHandler"
import { ISkill } from '../../model/Skill';
import { ApiResponse, CreateSkillRequest, UpdateSkillRequest } from '../../types/api/api-types';

export const getAllSkills = async (request: Request, response: Response<ApiResponse<ISkill[]>>) => {
  try {
    const skills = await skillService.getAllSkills();
    const responsePayload: ApiResponse<ISkill[]> = {
      success: true,
      message: `Skills retrieved successfully.`,
      data: skills
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const getSingleSkill = async (request: Request<{ id: string }>, response: Response<ApiResponse<ISkill>>) => {
  try {
    const { id } = request.params;
    const skill = await skillService.getSingleSkill(id);
    const responsePayload: ApiResponse<ISkill> = {
      success: true,
      message: `Skill ${skill.name} retrieved successfully.`,
      data: skill
    }

    response.json(responsePayload);
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

export const updateSkill = async (request: Request<{ id: string }, {}, UpdateSkillRequest>, response: Response<ApiResponse<ISkill>>) => {
  try {
    const { id } = request.params;
    const updatedSkill = await skillService.updateSkill(id, request.body);
    const responsePayload: ApiResponse<ISkill> = {
      success: true,
      message: `Skill ${updatedSkill.name} updated successfully.`,
      data: updatedSkill
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const deleteSkill = async (request: Request<{ id: string }>, response: Response<ApiResponse<ISkill>>) => {
  try {
    const { id } = request.params;
    const deletedSkill: ISkill = await skillService.deleteSkill(id);
    const responsePayload: ApiResponse<ISkill> = {
      success: true,
      message: `Skill ${deletedSkill.name} deleted successfully.`,
      data: deletedSkill
    }

    response.json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}