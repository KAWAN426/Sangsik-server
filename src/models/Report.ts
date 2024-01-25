import mongoose, { Document } from "mongoose";

interface IReport extends Document {
  postId: string;
  userId: string;
  reportType?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      ref: "Post",
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    reportType: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", reportSchema);
export default Report;
