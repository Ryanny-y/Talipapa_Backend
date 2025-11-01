import mongoose, { Schema } from "mongoose";

export type Roles = 'ADMIN' | 'SUPER_ADMIN';

export interface IAdmin extends Document {
  username: string;
  email: string;
  contactNumber: string;
  roles: Roles[];
  password: string;
  refreshToken: String,
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["ADMIN", "SUPER_ADMIN"],
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true, 
  }
)


adminSchema.pre<IAdmin>('save', function (next) {
  if(this.roles.includes("SUPER_ADMIN") && !this.roles.includes("ADMIN")) {
    this.roles.push("ADMIN");
  }
  
  next();
})

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;