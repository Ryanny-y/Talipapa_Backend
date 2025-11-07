import mongoose, { Schema, Document } from "mongoose";

export interface IStaff extends Document {
  name: string;
  age: string;
  gender: string;
  emailAddress?: string;
  position: string[];
  skills: mongoose.Types.ObjectId[];
  contactNumber?: string;
  assignedFarm: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    emailAddress: String,
    position: [
      { _id: false, 
        type: String, 
        required: true 
      }
    ],
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    contactNumber: String,
    assignedFarm: [
      {
        type: Schema.Types.ObjectId,
        ref: "Farm",
      },
    ],
  },
  { timestamps: true }
);

const Staff = mongoose.model<IStaff>("Staff", staffSchema);

export default Staff;
