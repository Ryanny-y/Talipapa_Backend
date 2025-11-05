import { PaginatedResponse } from "../..";

export interface StepPaylod {
  stepNumber?: number;
  title: string;
  description: string;
  requiredDocuments?: string[];
  estimatedTime?: string;
  tips?: string[];
}

interface GuidelinePayload {
  title: string;
  description: string;
  category: string;
  totalEstimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  steps: Step[];
}

export type CreateGuidelineRequest = GuidelinePayload;
export type UpdateGuidelineRequest = GuidelinePayload;