import * as pageContentService from "../../service/api/pageContentService";
import { Request, Response } from "express";
import { handleError } from "../../utils/errorResponseHandler";
import { IPageContent } from "../../model/PageContent";
import { ErrorResponse } from "../../types";

export const getPageContent = async (request: Request, response: Response<IPageContent | ErrorResponse>) => {
  try {
    const pageContent = await pageContentService.getPageContent();;
    return pageContent;
  } catch (error) {
    handleError(error, response);    
  }
}