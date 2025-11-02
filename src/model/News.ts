import mongoose, { Document, Schema } from "mongoose";

export type NewsPriority = "LOW" | "MEDIUM" | "HIGH"

export interface INews extends Document {
  _id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  category: string;
  priority: NewsPriority;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    required: false,
  },
}, { timestamps: true});


const News = mongoose.model<INews>("News", newsSchema);

export default News;