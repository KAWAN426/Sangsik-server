import mongoose, { Document } from "mongoose";

interface IPost extends Document {
  _id: string;
  title: string;
  description: string;
  contents: string;
  previewImage?: string;
  authorId: string;
  likes: string[];
  bookmarks: string[];
  likeCount: number;
  bookmarkCount: number;
  toggleLike: (userId: string) => void;
  toggleBookmark: (userId: string) => void;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    contents: {
      type: String,
      required: true,
    },
    previewImage: {
      type: String,
    },
    authorId: {
      type: String,
      required: true,
      ref: "User",
    },
    likes: [String],
    bookmarks: [String],
    likeCount: {
      type: Number,
    },
    bookmarkCount: {
      type: Number,
    },
    aiTestResult: {
      type: Boolean,
      required: true,
    },
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
  this.likeCount = this.likes.length;
};

postSchema.methods.toggleBookmark = function (userId: string) {
  const index = this.bookmarks.indexOf(userId);
  if (index === -1) {
    this.bookmarks.push(userId);
  } else {
    this.bookmarks.splice(index, 1);
  }
  this.bookmarkCount = this.bookmarks.length;
};

postSchema.index({ title: "text", description: "text" });

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
