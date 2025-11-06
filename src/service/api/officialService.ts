import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Official, { IOfficial } from "../../model/Official";
import { CreateOfficialRequest, UpdateOfficiaiRequest } from "../../types/api/official/request";
import { MulterS3File } from "../../types/express";
import deleteFromS3 from "../../utils/deleteFromS3";

export const getAllOfficials = async (): Promise<IOfficial[]> => {
  return await Official.find().lean<IOfficial[]>();
}

export const createOfficial = async (officialDetails: CreateOfficialRequest, officialImage: MulterS3File | undefined): Promise<IOfficial> => {
  const { name, biography, position } = officialDetails;

  if(!name || !position) throw new CustomError(400, "Official name and position are required.");
  
  if(!officialImage) throw new CustomError(400, "Official Image is required!");
  
  const existingOfficial = await Official.findOne({ name }).lean();
  if(existingOfficial) throw new CustomError(409, `Official ${name} already exists.`);

  const createdOffial = await Official.create({
    name,
    biography,
    position,
    image: {
      url: officialImage.location,
      key: officialImage.key,
      originalName: officialImage.originalname,
      size: officialImage.size,
      mimetype: officialImage.mimetype
    }
  })
  
  return createdOffial;
}

export const updateOfficial = async (id: string, officialDetails: UpdateOfficiaiRequest, officialImage: MulterS3File | undefined): Promise<IOfficial> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Official ID: ${id} is invalid.`);
  
  const existingOfficial = await Official.findById(id);
  if(!existingOfficial) throw new CustomError(404, `Official with ID: ${id} not found.`);

  const { name, biography, position } = officialDetails;

  if(name && name !== existingOfficial.name) {
    const existingName = await Official.findOne({
      name,
      _id: { $ne: id }
    });
    if(existingName) throw new CustomError(409, `Official with ${name} already exists.`);
  }

  const fieldsToUpdate: Record<string, any> = {};

  if(name !== undefined) fieldsToUpdate.name = name;
  if(biography !== undefined) fieldsToUpdate.biography = biography;
  if(position !== undefined) fieldsToUpdate.position = position;

  if(officialImage) {
    if(existingOfficial.image && existingOfficial.image.key) {
      await deleteFromS3(existingOfficial.image.key);
    }

    fieldsToUpdate.image = {
      url: officialImage.location,
      key: officialImage.key,
      originalName: officialImage.originalname,
      size: officialImage.size,
      mimetype: officialImage.mimetype
    }
  }

  const updatedOfficial = await Official.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedOfficial) throw new CustomError(500, `Unexpected error: Product update failed for ID ${id}.`);

  return updatedOfficial;

}

export const deleteOfficial = async (id: string): Promise<IOfficial> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Official ID: ${id} is invalid.`);  

  const deletedOfficial = await Official.findByIdAndDelete(id);
  if(deletedOfficial?.image?.key) {
    await deleteFromS3(deletedOfficial.image.key);
  }

  if(!deletedOfficial) throw new CustomError(404, `Official with ID: ${id} not found.`);

  return deletedOfficial;
}