import { IPageContent } from "../../../model/PageContent";

interface PageContentResponse {
  message: string;
  data: IPageContent
}

export type CreatePageContentResponse = PageContentResponse;
export type updatePageContentResponse = PageContentResponse;