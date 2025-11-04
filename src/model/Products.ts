import mongoose, { Schema } from "mongoose";
import { ImageInterface } from "../types";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  stocks: number;
  requiredPoints: number;
  image: ImageInterface;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  stocks: {
    type: Number,
    default: 0,
  },
  requiredPoints: {
    type: Number,
    required: true,
  },
  image:  {
    url: String,
    key: String,
    originalName: String,
    size: Number,
    mimetype: String
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
