import mongoose, { Document, Schema} from "mongoose";
import { ImageInterface } from "../types";

export interface IAchievement extends Document {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: ImageInterface;
  createdAt: string;
  updatedAt: string;
};

const achievementSchema = new Schema<IAchievement>(
  {
    title: {
    type: String,
    required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    image: {
      url: String,
      key: String,
      originalName: String,
      size: Number,
      mimetype: String,
    },
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;