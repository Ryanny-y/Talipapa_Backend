import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import PageContent from "../../model/PageContent";
import { IPageContent } from "../../model/PageContent";
import { CreatePageContentRequest, UpdatePageContentRequest } from "../../types/api/pageContent/request";
import { MulterS3File } from "../../types/express";
import deleteFromS3 from "../../utils/deleteFromS3";

export const getPageContent = async (): Promise<IPageContent> => {
  const result = await PageContent.findOne().lean<IPageContent>();
  
  if (!result) {
    throw new CustomError(404, "No available page content");
  }
  return result;
}

export const createPageContent = async (pageContentDetails: CreatePageContentRequest, barangayLogo: MulterS3File | undefined): Promise<IPageContent> => {
  const { mission, vision, barangayName, barangayDescription, barangayHistory } = pageContentDetails;

  if(!mission || !vision || !barangayName || !barangayDescription || !barangayHistory) {
    throw new CustomError(400, "All fields are required!");
  }

  const pageContentCount = await PageContent.countDocuments();
  
  if(pageContentCount > 0) {
    throw new CustomError(400, "Barangay Content already exists");
  }

  if(!barangayLogo) {
    throw new CustomError(400, "Barangay Logo is required!");
  }

  const createdPageContent = await PageContent.create({
    mission,
    vision,
    barangayName,
    barangayDescription,
    barangayHistory,
    barangayLogo: {
      url: barangayLogo.location,
      key: barangayLogo.key,
      originalName: barangayLogo.originalname,
      size: barangayLogo.size,
      mimetype: barangayLogo.mimetype,
    }
  });

  return createdPageContent;
}

export const updatePageContent = async (id: string, pageContentDetails: UpdatePageContentRequest, barangayLogo: MulterS3File | undefined): Promise<IPageContent> => {
  
  if(!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError(400, "Invalid Page Content ID!");
  }

  const existingPageContent = await PageContent.findById(id);
  if(!existingPageContent) {
    throw new CustomError(400, `Page Content not found with ID: ${id}`)
  }

  const { mission, vision, barangayName, barangayDescription, barangayHistory } = pageContentDetails;

  const fieldsToUpdate: Record<string, any> = {};

  if (mission) fieldsToUpdate.mission = mission;
  if (vision) fieldsToUpdate.vision = vision;
  if (barangayName) fieldsToUpdate.barangayName = barangayName;
  if (barangayDescription) fieldsToUpdate.barangayDescription = barangayDescription;
  if (barangayHistory) fieldsToUpdate.barangayHistory = barangayHistory;

  if (barangayLogo) {
    if (existingPageContent.barangayLogo && existingPageContent.barangayLogo.key) {
      await deleteFromS3(existingPageContent.barangayLogo.key);
    }

    fieldsToUpdate.barangayLogo = {
      url: barangayLogo.location,
      key: barangayLogo.key,
      originalName: barangayLogo.originalname,
      size: barangayLogo.size,
      mimetype: barangayLogo.mimetype,
    };
  }

  const updatedPageContent: IPageContent | null = await PageContent.findByIdAndUpdate(id, { $set: fieldsToUpdate }, { new: true, runValidators: true });
  if(!updatedPageContent) throw new CustomError(500, `Unexpected error: Page Content update failed for ID ${id}.`);

  return updatedPageContent;
}