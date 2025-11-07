import Skill, { ISkill } from "../../model/Skill";

export const getAllSkills = async (): Promise<ISkill[]> => {
  return await Skill.find().lean<ISkill[]>();
}