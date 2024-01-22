"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
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
    likes: [String],
    bookmarks: [String],
    likeCount: {
        type: Number,
        required: true,
    },
    bookmarkCount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
postSchema.methods.toggleLike = function (userId) {
    const index = this.likes.indexOf(userId);
    if (index === -1) {
        this.likes.push(userId);
    }
    else {
        this.likes.splice(index, 1);
    }
    this.likeCount = this.likes.length;
};
postSchema.methods.toggleBookmark = function (userId) {
    const index = this.bookmarks.indexOf(userId);
    if (index === -1) {
        this.bookmarks.push(userId);
    }
    else {
        this.bookmarks.splice(index, 1);
    }
    this.bookmarkCount = this.bookmarks.length;
};
postSchema.index({ _id: "text", title: "text" });
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map