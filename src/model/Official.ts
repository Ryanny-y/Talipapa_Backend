import mongoose, { Schema, Document, Model } from "mongoose";
import { ImageInterface } from "../types";

export interface IOfficial extends Document {
  name: string;
  position: string;
  biography?: string;
  image?: ImageInterface;
  createdAt: Date;
  updatedAt?: Date;
}

const OfficialsSchema: Schema<IOfficial> = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
  },
  image: {
    url: { type: String },
    key: { type: String },
    originalName: { type: String },
    size: { type: Number },
    mimetype: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Official: Model<IOfficial> = mongoose.model<IOfficial>("Official", OfficialsSchema);

export default Official;
