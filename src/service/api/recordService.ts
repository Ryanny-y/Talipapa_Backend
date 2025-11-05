import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Record, { IRecord } from "../../model/Record";
import { CreateRecordRequest, UpdateRecordRequest } from "../../types/api/record/request";
import { PaginatedRecordResponse } from "../../types/api/record/response";

export const getPaginatedRecords = async (page: number, limit: number, residentStatus: string ): Promise<PaginatedRecordResponse> => {
  const skip = (page - 1) * limit;
  const isResident = residentStatus === 'resident';

  const totalItems = await Record.countDocuments({ isResident });
  const data = await Record.find({ isResident })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IRecord[]>();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  }
}

export const createRecord = async (recordDetails: CreateRecordRequest): Promise<IRecord> => {
  const { firstName, lastName, middleName, suffix, age, gender, isResident, address, contactNumber } = recordDetails;

  if (!firstName || !lastName || !age || !gender) throw new CustomError(400, "All fields are required.");
  const existingRecord = await Record.findOne({
    firstName,
    lastName,
  }).collation({ locale: 'en', strength: 2 });
  
  if(existingRecord) throw new CustomError(409, `Record with name ${firstName} ${lastName} already exists.`);

  if(isNaN(age) || age <= 0) throw new CustomError(400, 'Age must be a positive number');

  if(contactNumber && contactNumber?.length !== 11) throw new CustomError(400, 'Contact number must be 11 digits only.'); 

  const newRecord = await Record.create({
    firstName,
    lastName,
    middleName,
    suffix,
    age,
    gender,
    isResident,
    address,
    contactNumber,
  });

  return newRecord;
}

export const updateRecord = async (
  id: string,
  recordDetails: UpdateRecordRequest
): Promise<IRecord> => {

  const existingRecord = await Record.findById(id);
  if (!existingRecord) throw new CustomError(404, `Record with ID: ${id} not found.`);

  const { firstName, lastName, middleName, suffix, age, gender, isResident, address, contactNumber } = recordDetails;

  if (firstName && lastName) {
      const duplicateRecord = await Record.findOne({
        firstName,
        lastName,
        _id: { $ne: id }
      }).collation({ locale: 'en', strength: 2 });
    if (duplicateRecord) throw new CustomError(409, `Record with name ${firstName} ${lastName} already exists.`);
  }

  if (age !== undefined) {
    if (isNaN(age) || age <= 0) throw new CustomError(400, "Age must be a positive number.");
  }

  if(contactNumber && contactNumber?.length !== 11) throw new CustomError(400, 'Contact number must be 11 digits only.'); 

  const fieldsToUpdate: Record<string, any> = {};

  if (firstName) fieldsToUpdate.firstName = firstName;
  if (lastName) fieldsToUpdate.lastName = lastName;
  if (middleName) fieldsToUpdate.middleName = middleName;
  if (suffix !== undefined) fieldsToUpdate.suffix = suffix;
  if (age !== undefined) fieldsToUpdate.age = age;
  if (gender) fieldsToUpdate.gender = gender;
  if (isResident !== undefined) fieldsToUpdate.isResident = isResident;
  if (address !== undefined) fieldsToUpdate.address = address;
  if (contactNumber !== undefined) fieldsToUpdate.contactNumber = contactNumber;

  const updatedRecord = await Record.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedRecord) throw new CustomError(500, `Unexpected error: Record update failed for ID ${id}.`);

  return updatedRecord;
};

export const deleteRecord = async (id: string): Promise<IRecord> => {
  const deletedRecord = await Record.findByIdAndDelete(id);
  if (!deletedRecord) throw new CustomError(404, `Record not found with ID: ${id}.`);
  
  return deletedRecord;
};

export const searchRecords = async (page: number, limit: number, query: string, residentStatus: string): Promise<PaginatedRecordResponse> => {
  const skip = (page - 1) * limit;

  const filter: any = {
    $or: [
      { _id: { $regex: query, $options: "i" } },
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { middleName: { $regex: query, $options: "i" } },
    ],
  };

  if (residentStatus === 'resident') filter.isResident = true;
  else if (residentStatus === 'non-resident') filter.isResident = false;
  else throw new CustomError(400, "Invalid Resident Status.");

  const totalItems = await Record.countDocuments(filter);
  
  const searchResults = await Record.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean<IRecord[]>();
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    data: searchResults,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  }
}