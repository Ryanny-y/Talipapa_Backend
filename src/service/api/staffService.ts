import mongoose, { mongo } from "mongoose";
import Staff, { IStaff } from "../../model/Staff";
import { CustomError } from "../../error/CustomError";
import { AddStaffRequest } from "../../types/api/api-types";

export const getStaffByFarm = async (farmId: string): Promise<IStaff[]> => {
  return await Staff.find({ farm: farmId }).populate("skills").lean<IStaff[]>();
}

export const addStaffToFarm = async (staffDetails: AddStaffRequest): Promise<IStaff> => {
  const { name, age, gender, emailAddress, position, skills, contactNumber, assignedFarm } = staffDetails;
  
  if(!name || !age || !gender || !position || position.length === 0 || !skills || skills.length === 0 || !assignedFarm || assignedFarm.length === 0) {
    throw new CustomError(400, `All fields are required.`);
  }

  if(!Array.isArray(position)) throw new CustomError(400, `Position must be an array of strings.`); 
  if(!Array.isArray(skills)) throw new CustomError(400, `Skills must be an array of skill IDs.`);
  if(!Array.isArray(assignedFarm)) throw new CustomError(400, `Assigned farm must be an array of farm IDs.`);

  if(contactNumber && contactNumber.length !== 11) throw new CustomError(400, `Contact number must be 11 digits long.`);

  await Promise.all([
    ...skills.map(async (skillId) => {
      if (!mongoose.isValidObjectId(skillId)) {
        throw new CustomError(400, `Invalid skill ID: ${skillId}`);
      }
    }),
    ...assignedFarm.map(async (farmId) => {
      if (!mongoose.isValidObjectId(farmId)) {
        throw new CustomError(400, `Invalid farm ID in assigned farms: ${farmId}`);
      }
    })
  ]);

  const existingStaff = await Staff.findOne({ name });
  if(existingStaff) throw new CustomError(409, `Staff member with name ${name} already exists.`);

  const newStaff = await Staff.create({
    name,
    age,
    gender,
    emailAddress,
    position,
    skills,
    contactNumber,
    assignedFarm
  });

  return newStaff;
}