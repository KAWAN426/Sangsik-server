"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportPost = exports.getPostList = exports.deletePost = exports.updatePost = exports.createPost = exports.togglePostBookmark = exports.togglePostLike = exports.getPostOne = void 0;
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("../lib/openai"));
const Post_1 = tslib_1.__importDefault(require("../models/Post"));
const Report_1 = tslib_1.__importDefault(require("../models/Report"));
const User_1 = tslib_1.__importDefault(require("../models/User"));
const uniqueIdGenerator_1 = tslib_1.__importDefault(require("../utils/uniqueIdGenerator"));
const zipString_1 = require("../utils/zipString");
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const getPostOne = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id).populate("authorId").exec();
        if (!post)
            return res.status(404).send({
                data: post,
                message: "해당하는 포스트를 찾지 못했습니다.",
                status: "success",
            });
        res.status(200).send({
            data: post,
            message: "포스트의 정보를 성공적으로 불러왔습니다.",
            status: "success",
        });
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.getPostOne = getPostOne;
const togglePostLike = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.postId);
        if (!post)
            return res.status(404).send({
                data: post,
                message: "해당하는 포스트를 찾지 못했습니다.",
                status: "success",
            });
        const userExists = await User_1.default.exists({ _id: req.params.userId });
        if (!userExists)
            return res.status(404).send({
                data: null,
                message: "사용자를 찾지 못했습니다.",
                status: "success",
            });
        post.toggleLike(req.params.userId);
        await post.save();
        res.status(200).send({
            data: { likes: post.likes.length },
            message: "좋아요를 성공적으로 수정했습니다.",
            status: "success",
        });
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "좋아요를 수정하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.togglePostLike = togglePostLike;
const togglePostBookmark = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.postId);
        if (!post)
            return res.status(404).send({
                data: null,
                message: "해당하는 포스트를 못했습니다.",
                status: "success",
            });
        const userExists = await User_1.default.exists({ _id: req.params.userId });
        if (!userExists)
            return res.status(404).send({
                data: null,
                message: "사용자를 찾지 못했습니다.",
                status: "success",
            });
        post.toggleBookmark(req.params.userId);
        await post.save();
        res.status(200).send({
            data: { bookmarks: post.bookmarks.length },
            message: "북마크를 성공적으로 수정했습니다.",
            status: "success",
        });
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "북마크를 수정하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.togglePostBookmark = togglePostBookmark;
const createPost = async (req, res) => {
    var _a;
    try {
        const { title, content, previewImage, authorId } = req.body;
        const doc = cheerio_1.default.load(content);
        doc("h1").remove();
        const q = `제목: ${title}, 내용: ${doc.text()}}`;
        const completion = await openai_1.default.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `다음 내용에서 확실하게 틀린 부분이 있다면 false, [틀린 부분] 이런 형식으로 작성해서 알려주고 만약 내용이 어느정도 옳바르면 true만을 전달해줘. ${q}`,
                },
            ],
            model: "gpt-4",
        });
        const _id = await (0, uniqueIdGenerator_1.default)(Post_1.default, 10);
        const newPost = new Post_1.default({
            _id,
            title,
            content: (0, zipString_1.compressString)(content),
            previewImage: previewImage !== null && previewImage !== void 0 ? previewImage : null,
            authorId,
            likes: [],
            bookmarks: [],
            likeCount: 0,
            bookmarkCount: 0,
        });
        const result = await newPost.save();
        if (result && result._id) {
            res.status(200).send({
                data: {
                    ai: (_a = completion.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                },
                message: `새로운 포스트를 생성했습니다. id:${_id}`,
                status: "success",
            });
        }
        else {
            res.status(400).send({
                data: null,
                message: `새로운 포스트를 생성하는데 실패했습니다.`,
                status: "success",
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            data: null,
            message: "새로운 포스트를 생성하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    try {
        const { title, content, previewImage } = req.body;
        const result = await Post_1.default.updateOne({ _id: req.params.id }, { $set: { title, content, previewImage } });
        if (result.modifiedCount === 1) {
            res.status(200).send({
                data: null,
                message: `성공적으로 포스트를 수정했습니다.`,
                status: "success",
            });
        }
        else {
            res.status(400).send({
                data: null,
                message: `포스트를 수정하는데 실패했습니다.`,
                status: "success",
            });
        }
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "포스트를 수정하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const result = await Post_1.default.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
            res.status(200).send({
                data: null,
                message: `성공적으로 포스트를 제거했습니다.`,
                status: "success",
            });
        }
        else {
            res.status(400).send({
                data: null,
                message: `포스트를 제거하지 못했습니다.`,
                status: "success",
            });
        }
    }
    catch (err) {
        res.status(500).send({
            data: null,
            message: "포스트를 제거하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.deletePost = deletePost;
const getPostList = async (req, res, filter) => {
    try {
        const keyword = req.query.q
            ? req.query.q
                .split(/\s+/)
                .map((word) => `(${word})`)
                .join("|")
            : undefined;
        const filterOb = typeof filter === "object" ? filter : {};
        const search = keyword
            ? {
                $or: [{ title: { $regex: keyword, $options: "i" } }],
            }
            : filterOb;
        const orderQuery = req.query.order;
        const order = [];
        if (orderQuery === "latest")
            order[0] = ["createdAt", -1];
        else if (orderQuery === "popular")
            order[0] = ["likeCount", -1];
        const posts = await Post_1.default.find(search)
            .sort(order)
            .populate("authorId")
            .select("-content")
            .exec();
        res.status(200).send({
            data: posts,
            message: "포스트의 정보를 성공적으로 불러왔습니다.1",
            status: "success",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: "포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.getPostList = getPostList;
const reportPost = async (req, res) => {
    try {
        const { postId, userId } = req.query;
        const newReport = new Report_1.default({
            postId,
            userId,
        });
        const result = await newReport.save();
        if (result && result._id) {
            res.status(200).send({
                data: null,
                message: `새로운 리포트를 생성했습니다. id:${result._id}`,
                status: "success",
            });
        }
        else {
            res.status(400).send({
                data: null,
                message: `새로운 리포트를 생성하는데 실패했습니다.`,
                status: "success",
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            data: null,
            message: "새로운 리포트를 생성하는 과정에서 오류가 발생했습니다.",
            status: "error",
        });
    }
};
exports.reportPost = reportPost;
//# sourceMappingURL=postController.js.map