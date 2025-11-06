import * as pageContentService from "../../service/api/pageContentService";
import { Request, Response } from "express";
import { handleError } from "../../utils/errorResponseHandler";
import { IPageContent } from "../../model/PageContent";
import { ErrorResponse } from "../../types";
import { MulterS3File } from "../../types/express";
import { ApiResponse, CreatePageContentRequest, UpdatePageContentRequest } from "../../types/api/api-types";

export const getPageContent = async (request: Request, response: Response<IPageContent | ErrorResponse>) => {
  try {
    const pageContent = await pageContentService.getPageContent();
    response.json(pageContent);
  } catch (error) {
    handleError(error, response);    
  }
}

export const createPageContent = async (request: Request<{}, {}, CreatePageContentRequest>, response: Response<ApiResponse<IPageContent>>) => {
  try {
    const imageFile = request.file;
    const createdPageContent = await pageContentService.createPageContent(request.body, imageFile);
    const responsePayload: ApiResponse<IPageContent> = {
      success: true,
      message: `Page Content Created Successfully!`,
      data: createdPageContent
    }

    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}

export const updatePageContent = async (request: Request<{ id: string }, {}, UpdatePageContentRequest>, response: Response<ApiResponse<IPageContent>>) => {
  try {
    const { id } = request.params;
    const imageFile = request.file;
    const updatePageContent = await pageContentService.updatePageContent(id, request.body, imageFile);
    const responsePayload: ApiResponse<IPageContent> = {
      success: true,
      message: `Page Content Updated Successfully!`,
      data: updatePageContent
    }

    response.json(responsePayload)
  } catch (error) {
    handleError(error, response);
  }
}