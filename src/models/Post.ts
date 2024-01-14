import generateUniqueUserId from "@/utils/uniqueIdGenerator";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: async () => await generateUniqueUserId(Post, 10),
    },
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    previewImage: {
      type: String,
      required: false,
    },
    authorId: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
