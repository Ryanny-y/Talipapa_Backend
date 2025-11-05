import mongoose, { Schema } from "mongoose";

export interface IStep {
  stepNumber: number;
  title: string;
  description: string;
  requiredDocuments: string[];
  estimatedTime?: string;
  tips: string[];
}

export interface IGuideline {
  _id: string;
  category: string;
  title: string;
  description: string;
  difficulty?: string;
  totalEstimatedTime?: string;
  lastUpdated?: Date;
  steps: IStep[];
  createdAt: Date;
  updatedAt: Date;
}

const stepSchema = new Schema<IStep>(
  {
    stepNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    estimatedTime: {
      type: String,
    },
    tips: {
      type: [String],
      default: [],
    },
  },
  { _id: false } 
);

const guidelineSchema = new Schema<IGuideline>(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
    },
    totalEstimatedTime: {
      type: String,
    },
    lastUpdated: {
      type: Date,
    },
    steps: {
      type: [stepSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Guideline = mongoose.model<IGuideline>("Guideline", guidelineSchema);

export default Guideline;
