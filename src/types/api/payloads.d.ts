import { ILocation } from "../../model/Farm";

export interface AchievementPayload {
  title: string;
  description: string;
  link?: string;
}

export interface NewsPayload {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  category: string;
  priority: string;
}

export interface StepPayload {
  stepNumber: number;
  title: string;
  description?: string;
  requiredDocuments?: string[];
  estimatedTime?: string;
  tips?: string[];
}

export interface GuidelinePayload {
  category: string;
  title: string;
  description: string;
  difficulty?: string;
  totalEstimatedTime?: string;
  steps: StepPayload[];
}

export interface MaterialPayload {
  name: string;
  description: string;
  pointsPerKg: number;
}

export interface OfficialPayload {
  name: string;
  biography?: string;
  position: string;
}

export interface PageContentPayload {
  mission: string;
  vision: string;
  barangayName: string;
  barangayHistory: string;
  barangayDescription: string;
  barangayLogo: ImageInterface;
  youtubeVideoUrl: String
}

export interface ProductPayload {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  stocks: number;
  requiredPoints: number;
}

export interface RecordPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  birthDate?: Date; 
  age: number;
  gender: string;
  isResident?: boolean;
  contactNumber?: string;
  address?: string;
  points?: number;
}

export interface FarmPayload {
  latitude: string;
  longitude: string;
  name: string;
  size: string;
  age: string;
  farmType: string;
  address: string;
  description: string;
}

export interface SkillPayload {
  name: string;
  short: string;
  type: string;
}