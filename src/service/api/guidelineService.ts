import mongoose from "mongoose";
import { CustomError } from "../../error/CustomError";
import Guideline, { IGuideline } from "../../model/Guideline";
import { CreateGuidelineRequest, StepPaylod, UpdateGuidelineRequest } from "../../types/api/guideline/request";
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

  const existingGuideline = await Guideline.findOne({ title }).lean();
  if(existingGuideline) throw new CustomError(409, `Guideline with title: ${title} already exists.`);

  const normalizedSteps = normalizeSteps(steps);
  
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

export const updateGuideline = async (id: string, guidelineDetails: UpdateGuidelineRequest): Promise<IGuideline> =>{
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Guideline ID: ${id} is invalid!`);

  const existingGuideline = await Guideline.findById(id);
  if(!existingGuideline) throw new CustomError(404, `Guideline with ID: ${id} not found.`);

  const { title, description, category, totalEstimatedTime, difficulty, steps } = guidelineDetails;
  
  if(!title || !description || !category || !difficulty) throw new CustomError(400, "Title, Descripion, Category, and Difficulty is requird!");
  
  if(!Array.isArray(steps) || steps.length === 0) throw new CustomError(400, "At least one step is required!. Invalid Step format.");
  
  if(title && title !== existingGuideline.title) {
    const existingName = await Guideline.findOne({
      title,
      _id: { $ne: id }
    });

    if(existingName) throw new CustomError(409, `Guideline with title: ${title} already exists`);
  }
  
  const normalizedSteps = normalizeSteps(steps);
  
  const fieldsToUpdate: Record<string, any> = {
    title,
    description,
    category,
    totalEstimatedTime,
    difficulty,
    steps: normalizedSteps,
  };

  const updatedGuideline = await Guideline.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedGuideline)
    throw new CustomError(500, `Unexpected error: Guideline update failed for ID ${id}.`);

  return updatedGuideline;
}

export const deleteGuideline = async (id: string): Promise<IGuideline> => {
  if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError(400, `Achievement ID: ${id} is invalid`);

  const deletedAchievement: IGuideline | null = await Guideline.findByIdAndDelete(id);
  if (!deletedAchievement) throw new CustomError(404, `Achievement not found with ID: ${id}`);

  return deletedAchievement;
}

function normalizeSteps(steps: StepPaylod[]) {
  return steps.map((s, idx) => ({
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
}