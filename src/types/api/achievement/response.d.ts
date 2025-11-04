import { PaginatedResponse } from "../..";
import { IAchievement } from "../../../model/Achievement";

interface AchievementResponse {
  message: string;
  data: IAchievement
}

export type PaginatedAchievementResponse = PaginatedResponse<IAchievement>;
export type CreateAchievementResponse = AchievementResponse;
export type UpdateAchievementResponse = AchievementResponse;