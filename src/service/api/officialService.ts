import { CustomError } from "../../error/CustomError";
import Official, { IOfficial } from "../../model/Official";
import { CreateOfficailRequest } from "../../types/api/official/request";
import { MulterS3File } from "../../types/express";

export const getAllOfficials = async (): Promise<IOfficial[]> => {
  return await Official.find().lean<IOfficial[]>();
}

export const createOfficial = async (officialDetails: CreateOfficailRequest, officialImage: MulterS3File | undefined): Promise<IOfficial> => {
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
