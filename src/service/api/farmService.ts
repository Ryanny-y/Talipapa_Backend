import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Farm, { IFarm } from "../../model/Farm";
import { CreateFarmRequest, UpdateFarmRequest } from "../../types/api/api-types";
import { MulterS3File } from "../../types/express";
import deleteFromS3 from "../../utils/deleteFromS3";

export const getFarm = async (): Promise<IFarm[]> => {
  return await Farm.find().lean<IFarm[]>();
};

export const createFarm = async (farmDetails: CreateFarmRequest, farmImage: MulterS3File | undefined): Promise<IFarm> => {
  const { latitude, longitude, name, size, age, farmType, address, description } = farmDetails;

  if(!latitude || !longitude || !name || !size || !age || !farmType || !address || !description) throw new CustomError(400, 'All fields are required.');

  const existingFarm = await Farm.findOne({ name });
  if(existingFarm) throw new CustomError(400, 'Farm with this name already exists.');

  if(!farmImage) throw new CustomError(400, 'Farm image is required.');
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  
  if(isNaN(parsedLatitude) || isNaN(parsedLongitude)) throw new CustomError(400, 'Invalid latitude or longitude.');
  if (parsedLatitude < -90 || parsedLatitude > 90) throw new CustomError(400, 'Latitude must be between -90 and 90.');
  if (parsedLongitude < -180 || parsedLongitude > 180) throw new CustomError(400, 'Longitude must be between -180 and 180.');
  
  const newFarm = await Farm.create({
    location: {
        lat: parsedLatitude,
        lng: parsedLongitude,
    },
    name,
    size,
    age,
    farmType,
    address,
    description,
    image: {
      url: farmImage.location,
      key: farmImage.key,
      originalName: farmImage.originalname,
      size: farmImage.size,
      mimetype: farmImage.mimetype,
    },
  })

  return newFarm;
}

export const updateFarm = async (id: string, farmDetails: UpdateFarmRequest, farmImage: MulterS3File | undefined): Promise<IFarm> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, 'Invalid farm ID.');

  const existingFarm = await Farm.findById(id);
  if(!existingFarm) throw new CustomError(404, 'Farm not found.');

  const { latitude, longitude, name, size, age, farmType, address, description } = farmDetails;

  if(name && name !== existingFarm.name) {
    const existingFarmName = await Farm.findOne({ 
      name,
      _id: { $ne: id }
    });
    if(existingFarmName) throw new CustomError(400, 'Another farm with this name already exists.');
  }

  const fieldsToUpdate: Record<string, any> = {};
  
  if(latitude) {
    const parsedLatitude = Number(latitude);
    if (parsedLatitude < -90 || parsedLatitude > 90) throw new CustomError(400, 'Latitude must be between -90 and 90.');
    if(isNaN(parsedLatitude)) throw new CustomError(400, 'Invalid latitude.');
    fieldsToUpdate['location.lat'] = parsedLatitude;
  }

  if(longitude) {
    const parsedLongitude = Number(longitude);
    if (parsedLongitude < -180 || parsedLongitude > 180) throw new CustomError(400, 'Longitude must be between -180 and 180.');
    if(isNaN(parsedLongitude)) throw new CustomError(400, 'Invalid longitude.');
    fieldsToUpdate['location.lng'] = parsedLongitude;
  }

  if(name !== undefined) fieldsToUpdate.name = name;
  if(size !== undefined) fieldsToUpdate.size = size;
  if(age !== undefined) fieldsToUpdate.age = age;
  if(farmType !== undefined) fieldsToUpdate.farmType = farmType;
  if(address !== undefined) fieldsToUpdate.address = address;
  if(description !== undefined) fieldsToUpdate.description = description;

  if(farmImage) {
    if(existingFarm.image && existingFarm.image?.key) {
      await deleteFromS3(existingFarm.image.key);
    }

    fieldsToUpdate.image = {
      url: farmImage.location,
      key: farmImage.key,
      originalName: farmImage.originalname,
      size: farmImage.size,
      mimetype: farmImage.mimetype,
    }
  }

  const updatedFarm = await Farm.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
  
  if(!updatedFarm) throw new CustomError(500, `Unexpected error: Farm update failed for ID ${id}.`);

  return updatedFarm;
}