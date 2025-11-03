import mongoose, { Schema } from "mongoose";
import { ImageInterface } from "../types";

export interface ICarousel {
  _id: string;
  title: string;
  subTitle?: string;
  link?: string;
  order: number;
  image: ImageInterface;
}

export interface IPageContent {
  _id: string;
  mission: string;
  vision: string;
  barangayName: string;
  barangayHistory: string;
  barangayDescription: string;
  barangayLogo: ImageInterface;
  carousel: ICarousel[];
}

const carouselSchema = new Schema<ICarousel>({
  title: {
    type: String,
    required: true,
  },
  subTitle: String,
  link: String,
  order: {
    type: Number,
    required: true,
  },
  image: {
    url: String,
    key: String,
    originalName: String,
    size: Number,
    mimetype: String,
  },
});

const pageContentSchema = new Schema<IPageContent>({
  mission: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  barangayName: {
    type: String,
    required: true,
  },
  barangayHistory: {
    type: String,
    required: true,
  },
  barangayDescription: {
    type: String,
    required: true,
  },
  barangayLogo: {
    url: String,
    key: String,
    originalName: String,
    size: Number,
    mimetype: String,
  },
  carousel: {
    type: [carouselSchema],
    default: [],
  },
});

const PageContent = mongoose.model<IPageContent>("PageContent", pageContentSchema);

export default PageContent;