import mongoose, { Document, Schema } from 'mongoose';
import Counter from './Counter';

export interface IRecord extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  birthDate?: Date; 
  age: number;
  gender: string;
  isResident?: boolean;
  address?: string;
  points?: number;
  contactNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    _id: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    middleName: {
      type: String,
      required: true,
      index: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    isResident: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    contactNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

recordSchema.pre<IRecord>('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'recordId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      if (!counter) {
        throw new Error('Failed to generate record ID');
      }

      this._id = `BT-${String(counter.seq).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

recordSchema.index(
  { firstName: 1, lastName: 1 },
  { collation: { locale: 'en', strength: 2 } }
);


const Record = mongoose.model<IRecord>('Record', recordSchema);

export default Record;
