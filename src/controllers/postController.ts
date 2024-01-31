import verifyContents from "@/lib/openai/verifyContents";
import Post from "@/models/Post";
import Report from "@/models/Report";
import User from "@/models/User";
import { TypedRequest, TypedResponse } from "@/types/express";
import generateUID from "@/utils/uniqueIdGenerator";
import { compressString } from "@/utils/zipString";
import { SortOrder } from "mongoose";

export const getPostOne = async (req: TypedRequest, res: TypedResponse) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId").exec();
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
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const togglePostLike = async (req: TypedRequest, res: TypedResponse) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).send({
        data: post,
        message: "해당하는 포스트를 찾지 못했습니다.",
        status: "success",
      });

    const userExists = await User.exists({ _id: req.params.userId });
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
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "좋아요를 수정하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const togglePostBookmark = async (
  req: TypedRequest,
  res: TypedResponse
) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).send({
        data: null,
        message: "해당하는 포스트를 못했습니다.",
        status: "success",
      });

    const userExists = await User.exists({ _id: req.params.userId });
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
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "북마크를 수정하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const createPost = async (
  req: TypedRequest<
    {},
    {
      title: string;
      contents: string;
      description: string;
      detail: string;
      previewImage?: string;
      authorId: string;
    }
  >,
  res: TypedResponse
) => {
  try {
    const { title, contents, detail, previewImage, authorId, description } =
      req.body;

    const aiResult = await verifyContents(title, detail);

    if (
      aiResult?.toLowerCase() === "true" ||
      aiResult?.toLowerCase() === "참"
    ) {
      const _id = await generateUID(Post, 10);

      const newPost = new Post({
        _id,
        title,
        description,
        contents: compressString(contents),
        previewImage: previewImage ?? null,
        authorId,
        likes: [],
        bookmarks: [],
        likeCount: 0,
        bookmarkCount: 0,
      });

      const result = await newPost.save();

      if (result && result._id)
        return res.status(200).send({
          data: {
            id: result._id,
          },
          message: `새로운 포스트를 생성했습니다. id:${_id}`,
          status: "success",
        });

      return res.status(400).send({
        data: null,
        message: `새로운 포스트를 생성하는데 실패했습니다.`,
        status: "error",
      });
    }

    res.status(200).send({
      data: {
        aiResult,
      },
      message: `새로운 포스트를 생성하는데 AI검사 과정에서 실패했습니다.`,
      status: "error",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      data: null,
      message: "새로운 포스트를 생성하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const updatePost = async (
  req: TypedRequest<
    {},
    {
      title: string;
      contents: string;
      previewImage?: string;
      detail: string;
      description: string;
    }
  >,
  res: TypedResponse
) => {
  try {
    const { title, contents, previewImage, detail, description } = req.body;

    const aiResult = await verifyContents(title, detail);
    if (
      aiResult?.toLowerCase() === "true" ||
      aiResult?.toLowerCase() === "참"
    ) {
      const result = await Post.updateOne(
        { _id: req.params.id },
        {
          $set: {
            title,
            contents: compressString(contents),
            previewImage,
            description,
          },
        }
      );
      if (result.modifiedCount === 1)
        return res.status(200).send({
          data: {
            id: req.params.id,
          },
          message: `성공적으로 포스트를 수정했습니다.`,
          status: "success",
        });
      return res.status(400).send({
        data: null,
        message: `포스트를 수정하는데 실패했습니다.`,
        status: "error",
      });
    }

    res.status(200).send({
      data: {
        aiResult,
      },
      message: `새로운 포스트를 생성하는데 AI검사 과정에서 실패했습니다.`,
      status: "error",
    });
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "포스트를 수정하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const deletePost = async (req: TypedRequest, res: TypedResponse) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.status(200).send({
        data: null,
        message: `성공적으로 포스트를 제거했습니다.`,
        status: "success",
      });
    } else {
      res.status(400).send({
        data: null,
        message: `포스트를 제거하지 못했습니다.`,
        status: "success",
      });
    }
  } catch (err) {
    res.status(500).send({
      data: null,
      message: "포스트를 제거하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const getPostList = async (
  req: TypedRequest<{ q?: string; order?: "latest" | "popular" }>,
  res: TypedResponse,
  filter?: Object
) => {
  try {
    const keyword = req.query.q
      ? req.query.q
          .split(/\s+/)
          .map((word: string) => `(${word})`)
          .join("|")
      : undefined;
    const filterOb = typeof filter === "object" ? filter : {};
    const search = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : filterOb;
    const orderQuery = req.query.order;
    const order: [string, SortOrder][] = [];

    if (orderQuery === "latest") order[0] = ["createdAt", -1];
    else if (orderQuery === "popular") order[0] = ["likeCount", -1];

    const posts = await Post.find(search)
      .sort(order)
      .populate("authorId")
      .select("-content")
      .exec();

    res.status(200).send({
      data: posts,
      message: "포스트의 정보를 성공적으로 불러왔습니다.1",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      data: null,
      message: "포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const reportPost = async (
  req: TypedRequest<{
    postId: string;
    userId: string;
    reportType?: string;
    description?: string;
  }>,
  res: TypedResponse
) => {
  try {
    const { postId, userId } = req.query;
    const newReport = new Report({
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
    } else {
      res.status(400).send({
        data: null,
        message: `새로운 리포트를 생성하는데 실패했습니다.`,
        status: "error",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      data: null,
      message: "새로운 리포트를 생성하는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};
