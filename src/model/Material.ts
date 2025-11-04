import mongoose, { Schema } from "mongoose";
import { ImageInterface } from "../types";

export interface IMaterial {
  _id: string;
  name: string;
  description: string;
  pointsPerKg: number;
  image: ImageInterface;
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema<IMaterial>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pointsPerKg: {
      type: Number,
      default: 1,
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

const Material = mongoose.model<IMaterial>("Material", materialSchema);

export default Material;
