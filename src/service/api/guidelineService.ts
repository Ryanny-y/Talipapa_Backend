import { CustomError } from "../../error/CustomError";
import Guideline, { IGuideline } from "../../model/Guideline";
import { CreateGuidelineRequest } from "../../types/api/guideline/request";
import { PaginatedGuidelineResponse } from "../../types/api/guideline/response";

export const getPaginatedGuidelines = async (page: number, limit: number): Promise<PaginatedGuidelineResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await Guideline.countDocuments();
  const data = await Guideline.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page * limit < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page * limit < totalItems ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  }
};

export const createGuidelines = async (guidelineDetails: CreateGuidelineRequest): Promise<IGuideline> => {
  const { title, description, category, totalEstimatedTime, difficulty, steps } = guidelineDetails;
  if(!title || !description || !category || !difficulty) throw new CustomError(400, "Title, Descripion, Category, and Difficulty is requird!");
  
  if(!Array.isArray(steps) || steps.length === 0) throw new CustomError(400, "At least one step is required!. Invalid Step format.");

  const normalizedSteps = steps.map((s, idx) => ({
    stepNumber: s.stepNumber ?? idx + 1,
    title: s.title || `Step ${idx + 1}`,
    description: s.description || "",
    requiredDocuments: Array.isArray(s.requiredDocuments)
      ? s.requiredDocuments
      : s.requiredDocuments
      ? [s.requiredDocuments]
      : [],
    estimatedTime: s.estimatedTime || s.estimatedTime || "",
    tips: Array.isArray(s.tips) ? s.tips : s.tips ? [s.tips] : [],
  }));
  
  const newGuideline = await Guideline.create({
    title,
    description,
    category,
    totalEstimatedTime,
    difficulty,
    steps: normalizedSteps
  });

  return newGuideline;
}