import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  loginMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false,
    },
    loginMethod: {
      type: String,
      required: true,
    },
    externalId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
