import mongoose, { mongo } from "mongoose";
import Staff, { IStaff } from "../../model/Staff";
import { CustomError } from "../../error/CustomError";
import { AddStaffRequest, UpdateStaffRequest } from "../../types/api/api-types";
import { PaginatedResponse } from "../../types";

export const getPaginatedStaff = async (page: number, limit: number): Promise<PaginatedResponse<IStaff>> => {
  const skip = (page - 1) * limit;
  const totalItems = await Staff.countDocuments();

  const staffs = await Staff.find().skip(skip).limit(limit).lean<IStaff[]>();
  const totalPages = Math.ceil(totalItems / limit);


  return {
    page,
    limit,
    data: staffs,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
}

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

export const updateStaff = async (staffId: string, staffDetails: UpdateStaffRequest): Promise<IStaff> => {
  if(!mongoose.isValidObjectId(staffId)) throw new CustomError(400, `Invalid staff ID: ${staffId}`);

  const existingStaff = await Staff.findById(staffId);
  if(!existingStaff) throw new CustomError(404, `Staff member with ID ${staffId} not found.`);

  const { name, age, gender, emailAddress, position, skills, contactNumber, assignedFarm } = staffDetails;
  
  if(name && existingStaff.name !== name) {
    const existingNameStaff = await Staff.findOne({ name, _id: { $ne: staffId } });
    if(existingNameStaff) throw new CustomError(409, `Another staff member with name ${name} already exists.`);
  }

  if(position) {
    if(position.length === 0) throw new CustomError(400, `Position is required and cannot be empty.`);
    if(!Array.isArray(position)) throw new CustomError(400, `Position must be an array of strings.`);
    if(position.includes("")) throw new CustomError(400, `Position cannot contain an empty string.`);
  }
  if(skills) {
    if(skills.length === 0) throw new CustomError(400, `Skills are required and cannot be empty.`);    
    if(!Array.isArray(skills)) throw new CustomError(400, `Skills must be an array of skill IDs.`);
    skills.forEach(skillId => {
      if (!mongoose.isValidObjectId(skillId)) {
        throw new CustomError(400, `Invalid skill ID: ${skillId}`);
      }
    });
  }
  if(assignedFarm) {
    if(assignedFarm.length === 0) throw new CustomError(400, `Assigned farm is required and cannot be empty.`);
    if(!Array.isArray(assignedFarm)) throw new CustomError(400, `Assigned farm must be an array of farm IDs.`);
    assignedFarm.forEach(farmId => {
      if (!mongoose.isValidObjectId(farmId)) {
        throw new CustomError(400, `Invalid farm ID in assigned farms: ${farmId}`);
      }
    });
  }

  if(contactNumber && contactNumber.length !== 11) throw new CustomError(400, `Contact number must be 11 digits long.`);

  const fieldsToUpdate: Record<string, any> = {};

  if(name !== undefined) fieldsToUpdate.name = name;
  if(age !== undefined) fieldsToUpdate.age = age;
  if(gender !== undefined) fieldsToUpdate.gender = gender;
  if(emailAddress !== undefined) fieldsToUpdate.emailAddress = emailAddress;
  if(position !== undefined) fieldsToUpdate.position = position;
  if(skills !== undefined) fieldsToUpdate.skills = skills;
  if(contactNumber !== undefined) fieldsToUpdate.contactNumber = contactNumber;
  if(assignedFarm !== undefined) fieldsToUpdate.assignedFarm = assignedFarm;

  const updatedStaff = await Staff.findByIdAndUpdate(staffId, { $set: fieldsToUpdate }, { new: true }).populate("skills").populate("assignedFarm", "name").lean<IStaff>();
  if(!updatedStaff) throw new CustomError(500, `Failed to update staff member with ID ${staffId}.`);

  return updatedStaff;
}

export const deleteStaff = async (staffId: string): Promise<IStaff> => {
  if(!mongoose.isValidObjectId(staffId)) throw new CustomError(400, `Invalid staff ID: ${staffId}`);

  const deletedStaff = await Staff.findByIdAndDelete(staffId).populate("skills").populate("assignedFarm", "name").lean<IStaff>();
  if(!deletedStaff) throw new CustomError(404, `Staff member with ID ${staffId} not found.`);

  return deletedStaff;
}