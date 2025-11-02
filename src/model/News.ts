import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  category: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
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
    required: false,
  },
}, { timestamps: true});


const News = mongoose.model<INews>("News", newsSchema);

export default News;