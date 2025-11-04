import { CustomError } from "../../error/CustomError";
import PageContent from "../../model/PageContent";
import { IPageContent } from "../../model/PageContent";
import { CreatePageContentRequest } from "../../types/api/pageContent/request";
import { MulterS3File } from "../../types/express";

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