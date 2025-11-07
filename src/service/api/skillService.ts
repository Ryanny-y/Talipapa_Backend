import { CustomError } from "../../error/CustomError";
import Skill, { ISkill } from "../../model/Skill";
import { CreateSkillRequest } from "../../types/api/api-types";

export const getAllSkills = async (): Promise<ISkill[]> => {
  return await Skill.find().lean<ISkill[]>();
}

export const createSkill = async (skillDetails: CreateSkillRequest): Promise<ISkill> => {
  const { name, short, type } = skillDetails;
  
  if(!name || !short || !type) throw new Error('All fields are required.');

  const existingSkill = await Skill.findOne({ name });
  if(existingSkill) throw new CustomError(409, `Skill with name ${name} already exists.`);

  const newSkill = await Skill.create({
    name,
    short,
    type,
  });

  return newSkill;
}