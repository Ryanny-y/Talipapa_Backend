import { PaginatedResponse } from "../..";
import { IAchievement } from "../../../model/Achievement";

interface AchievementResponse {

}

export type PaginatedAchievementResponse = PaginatedResponse<IAchievement>;