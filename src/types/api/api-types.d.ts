import { ErrorResponse } from '..';
import {
  AchievementPayload,
  NewsPayload,
  GuidelinePayload,
  MaterialPayload,
  OfficialPayload,
  PageContentPayload,
  ProductPayload,
  RecordPayload,
  FarmPayload,
  SkillPayload
} from './payloads';

// Achievement
export type CreateAchievementRequest = AchievementPayload;
export type UpdateAchievementRequest = Partial<AchievementPayload>;

// News
export type CreateNewsRequest = NewsPayload;
export type UpdateNewsRequest = Partial<NewsPayload>;

// Guideline
export type CreateGuidelineRequest = GuidelinePayload;
export type UpdateGuidelineRequest = Partial<GuidelinePayload>;

// Material
export type CreateMaterialRequest = MaterialPayload;
export type UpdateMaterialRequest = Partial<MaterialPayload>;

// Official
export type CreateOfficialRequest = OfficialPayload;
export type UpdateOfficialRequest = Partial<OfficialPayload>;

// Page Content
export type CreatePageContentRequest = PageContentPayload;
export type UpdatePageContentRequest = Partial<PageContentPayload>;

// Product
export type CreateProductRequest = ProductPayload;
export type UpdateProductRequest = Partial<ProductPayload>;

// Record
export type CreateRecordRequest = RecordPayload;
export type UpdateRecordRequest = Partial<RecordPayload>;

// Farm
export type CreateFarmRequest = FarmPayload;
export type UpdateFarmRequest = Partial<FarmPayload>;

// Skill
export type CreateSkillRequest = SkillPayload;
export type UpdateSkillRequest = Partial<SkillPayload>;

// Generic Response Types
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;