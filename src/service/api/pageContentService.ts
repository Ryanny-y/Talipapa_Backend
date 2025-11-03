import { CustomError } from "../../error/CustomError";
import PageContent from "../../model/PageContent";
import { IPageContent } from "../../model/PageContent";

export const getPageContent = async (): Promise<IPageContent> => {
  const result = await PageContent.findOne().lean<IPageContent>();
  if (!result) {
    throw new CustomError(404, "No available page content");
  }
  return result;
}