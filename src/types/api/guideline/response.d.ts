import { IGuideline } from "../../../model/Guideline";

interface GuidelineResponse {
  message: String,
  data: IGuideline
}

export type PaginatedGuidelineResponse = PaginatedResponse<IGuideline>;
export type CreateGuidelineResponse = GuidelineResponse;
export type UpdateGuidelineResponse = GuidelineResponse;