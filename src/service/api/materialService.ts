import { CustomError } from "../../error/CustomError";
import Material, { IMaterial } from "../../model/Material";
import { CreateMaterialRequest, MaterialRequest } from "../../types/api/material/request";
import { PaginatedMaterialResponse } from "../../types/api/material/response";
import { MulterS3File } from "../../types/express";

export const getPaginatedMaterials = async (page: number, limit: number): Promise<PaginatedMaterialResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Material.countDocuments();
  const data = await Material.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
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
};

export const createMaterial = async (materialDetails: CreateMaterialRequest, materialImage: MulterS3File | undefined): Promise<IMaterial> => {
  const { name, description, pointsPerKg } = materialDetails

  if(!name || pointsPerKg === undefined) throw new CustomError(400, "Material name and points per kilogram is required.");

  if(isNaN(pointsPerKg) || pointsPerKg <= 0) throw new CustomError(400, "Point per kilogram is must be a positive integer.");

  if(!materialImage) throw new CustomError(400, "Material image is required.")
  
  const existingMaterial = await Material.findOne({ name }).lean();
  if(existingMaterial) throw new CustomError(409, `Material with name ${name} already exists.`);

  const newMaterialData = await Material.create({
    name,
    description,
    image: {
      url: materialImage.location,
      key: materialImage.key,
      originalName: materialImage.originalname,
      size: materialImage.size,
      mimetype: materialImage.mimetype,
    },
  });

  return newMaterialData;
}