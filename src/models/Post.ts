import generateUID from "@/utils/uniqueIdGenerator";
import mongoose, { Document } from "mongoose";

interface IPost extends Document {
  _id: string;
  title: string;
  content: string;
  previewImage?: string;
  authorId: string;
  likes: string[];
  bookmarks: string[];
  toggleLike: (userId: string) => void;
  toggleBookmark: (userId: string) => void;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: async () => await generateUID(Post, 10),
    },
    title: {
      type: String,
      required: true,
    },
    content: {
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
    likes: [
      {
        type: String,
        ref: "User",
        unique: true,
      },
    ],
    bookmarks: [
      {
        type: String,
        ref: "User",
        unique: true,
      },
    ],
  },
  { timestamps: true }
);

postSchema.methods.toggleLike = function (userId: string) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
};

postSchema.methods.toggleBookmark = function (userId: string) {
  const index = this.bookmarks.indexOf(userId);
  if (index === -1) {
    this.bookmarks.push(userId);
  } else {
    this.bookmarks.splice(index, 1);
  }
};

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
