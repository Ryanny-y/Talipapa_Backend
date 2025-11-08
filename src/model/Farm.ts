import mongoose, { Schema, Document } from 'mongoose';
import { ImageInterface } from '../types';

export interface ILocation {
    lat: number;
    lng: number;
  }

export interface IFarm extends Document {
  _id: string;
  location: ILocation;
  name: string;
  size: string;
  age: string;
  farmType: string;
  address: string;
  description: string;
  image: ImageInterface;
}

const farmSchema: Schema = new Schema({
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }, 
  name: {
    type: String,
    required: true,
    index: true 
  },
  size: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  farmType: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true  
  },
  description: {
    type: String,
    required: true
  },
  image: {
    url: String,
    key: String,
    originalName: String,
    size: Number,
    mimetype: String,
  },
}, {
  timestamps: true 
});

farmSchema.virtual('staff', {
  ref: 'Staff',
  localField: '_id',
  foreignField: 'assignedFarm',
  justOne: false,
});

farmSchema.set('toObject', { virtuals: true });
farmSchema.set('toJSON', { virtuals: true });

export const Farm = mongoose.model<IFarm>('Farm', farmSchema);
export default Farm;