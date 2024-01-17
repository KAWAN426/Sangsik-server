import openai from "@/lib/openai";
import Post from "@/models/Post";
import User from "@/models/User";
import { TypedRequest, TypedResponse } from "@/types/express";
import generateUID from "@/utils/uniqueIdGenerator";
import { compressString } from "@/utils/zipString";
import cheerio from "cheerio";

export const getPostOne = async (req: TypedRequest, res: TypedResponse) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId").exec();
    if (!post)
      return res.status(404).send({
        data: post,
        message: "해당하는 포스트를 찾지 못했습니다.",
        status: "success",
      });

    const responseData = {
      ...post.toObject(),
      likes: post.likes.length,
      bookmarks: post.bookmarks.length,
    };

    res.status(200).send({
      data: responseData,
      message: "포스트의 정보를 성공적으로 불러왔습니다.11111",
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

export const getLatestPosts = async (
  req: TypedRequest,
  res: TypedResponse,
  filter: Object = {}
) => {
  try {
    const latestPosts = await Post.find()
      .sort([["createdAt", -1]])
      .populate("authorId")
      .exec();

    res.status(200).send({
      data: latestPosts,
      message: "최신순 포스트의 정보를 성공적으로 불러왔습니다.1",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      data: null,
      message: "최신순 포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
      status: "error",
    });
  }
};

export const getPopularPosts = async (
  req: TypedRequest,
  res: TypedResponse,
  filter: Object = {}
) => {
  try {
    const popularPosts = await Post.find()
      .sort("likeCount")
      .populate("authorId")
      .exec();

    res.status(200).send({
      data: popularPosts,
      message: "인기순 포스트의 정보를 성공적으로 불러왔습니다.",
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      data: null,
      message: "인기순 포스트의 정보를 불러오는 과정에서 오류가 발생했습니다.",
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
    { title: string; content: string; previewImage?: string; authorId: string }
  >,
  res: TypedResponse
) => {
  try {
    const { title, content, previewImage, authorId } = req.body;

    const doc = cheerio.load(content);

    doc("h1").remove();

    const q = `제목: ${title}, 내용: ${doc.text()}}`;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `다음 내용에서 확실하게 틀린 부분이 있다면 false, [틀린 부분] 이런 형식으로 작성해서 알려주고 만약 내용이 어느정도 옳바르면 true만을 전달해줘. ${q}`,
        },
      ],
      model: "gpt-4",
    });

    const _id = await generateUID(Post, 10);

    const newPost = new Post({
      _id,
      title,
      content: compressString(content),
      previewImage: previewImage ?? null,
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
          ai: completion.choices[0].message.content?.toLowerCase(),
        },
        message: `새로운 포스트를 생성했습니다. id:${_id}`,
        status: "success",
      });
    } else {
      res.status(400).send({
        data: null,
        message: `새로운 포스트를 생성하는데 실패했습니다.`,
        status: "success",
      });
    }
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
    { title?: string; content?: string; previewImage?: string }
  >,
  res: TypedResponse
) => {
  try {
    const { title, content, previewImage } = req.body;
    const result = await Post.updateOne(
      { _id: req.params.id },
      { $set: { title, content, previewImage } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).send({
        data: null,
        message: `성공적으로 포스트를 수정했습니다.`,
        status: "success",
      });
    } else {
      res.status(400).send({
        data: null,
        message: `포스트를 수정하는데 실패했습니다.`,
        status: "success",
      });
    }
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
