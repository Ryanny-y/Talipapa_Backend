import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Skill, { ISkill } from "../../model/Skill";
import { CreateSkillRequest, UpdateSkillRequest } from "../../types/api/api-types";

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

export const updateSkill = async (id: string, skillDetails: UpdateSkillRequest): Promise<ISkill> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Invalid skill id: ${id}`);

  const existingSkill = await Skill.findById(id);
  if(!existingSkill) throw new CustomError(404, `Skill with id ${id} not found.`);

  const { name, short, type } = skillDetails  ;

  if(name && existingSkill.name !== name) {
    const existingName = await Skill.findOne({ name, _id: { $ne: id } });
    if(existingName) throw new CustomError(409, `Skill with name ${name} already exists.`);
  }

  const fieldsToUpdate: Record<string, any> = {};

  if(name) fieldsToUpdate.name = name;
  if(short) fieldsToUpdate.short = short;
  if(type) fieldsToUpdate.type = type;

  const updatedSkill = await Skill.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true });
  if(!updatedSkill) throw new CustomError(500, `Failed to update skill with id ${id}.`);

  return updatedSkill;
}