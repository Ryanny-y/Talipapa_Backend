import { CustomError } from "../../error/CustomError";
import Farm, { IFarm } from "../../model/Farm";
import { CreateFarmRequest } from "../../types/api/api-types";
import { MulterS3File } from "../../types/express";

export const getFarm = async (): Promise<IFarm[]> => {
  return await Farm.find().lean<IFarm[]>();
};

export const createFarm = async (farmDetails: CreateFarmRequest, farmImage: MulterS3File | undefined): Promise<IFarm> => {
  const { latitude, longitude, name, size, age, farmType, address, description } = farmDetails;

  if(!latitude || !longitude || !name || !size || !age || !farmType || !address || !description) throw new CustomError(400, 'All fields are required.');

  if(!farmImage) throw new CustomError(400, 'Farm image is required.');
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if(isNaN(parsedLatitude) || isNaN(parsedLongitude)) throw new CustomError(400, 'Invalid latitude or longitude.');

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