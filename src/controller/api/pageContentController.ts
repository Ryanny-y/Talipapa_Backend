import * as pageContentService from "../../service/api/pageContentService";
import { Request, Response } from "express";
import { handleError } from "../../utils/errorResponseHandler";
import { IPageContent } from "../../model/PageContent";
import { ErrorResponse } from "../../types";
import { CreatePageContentResponse } from "../../types/api/pageContent/response";
import { CreatePageContentRequest } from "../../types/api/pageContent/request";

export const getPageContent = async (request: Request, response: Response<IPageContent | ErrorResponse>) => {
  try {
    const pageContent = await pageContentService.getPageContent();;
    return pageContent;
  } catch (error) {
    handleError(error, response);    
  }
}

export const createPageContent = async (request: Request<{}, {}, CreatePageContentRequest>, response: Response<CreatePageContentResponse | ErrorResponse>) => {
  try {
    const imageFile = request.file;
    const createdPageContent = await pageContentService.createPageContent(request.body, imageFile);
    const responsePayload: CreatePageContentResponse = {
      message: `Page Content Created Successfully!`,
      data: createdPageContent
    }
    response.status(201).json(responsePayload);
  } catch (error) {
    handleError(error, response);
  }
}