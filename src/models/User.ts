import generateUniqueUserId from "@/utils/uniqueIdGenerator";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
      required: true,
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
  },
  { timestamps: true }
);

userSchema.index({ _id: 1 });

const User = mongoose.model("User", userSchema);
export default User;
