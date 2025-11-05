import mongoose, { Document, Schema } from 'mongoose';
import Counter from './Counter';

export interface IRecord extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  age: string;
  gender: string;
  isResident?: boolean;
  address?: string;
  points?: number;
  contact_number?: string;
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
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    age: {
      type: String,
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
    contact_number: {
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

const Record = mongoose.model<IRecord>('Record', recordSchema);

export default Record;
