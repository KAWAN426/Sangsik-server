import { Router } from "express";
import * as PostController from "@/controllers/postController";

const router = Router();

//* desc 특정 id의 포스트 데이터 얻어옴
//* params: { id: string }
router.get("/one/:id", PostController.getPostOne);

//* desc 모든 포스트 최신순 정렬
router.get("/latest", (req, res) =>
  PostController.getLatestPosts(req, res, {})
);

//* desc 모든 포스트 중에서 좋아요 순 정렬
router.get("/popular", (req, res) =>
  PostController.getPopularPosts(req, res, {})
);

//* desc 특정 사용자가 북마크한 포스트를 인기순으로 정렬
//* params: { userId: string }
router.get("/user/bookmarks/:userId", (req, res) =>
  PostController.getPopularPosts(req, res, {
    bookmarks: req.params.userId,
  })
);

//* desc 특정 사용자의 포스트를 최신순으로 정렬
//* params: { postId: string, userId: string }
router.get("/user/:userId", (req, res) =>
  PostController.getLatestPosts(req, res, { authorId: req.params.userId })
);

//* desc 포스트의 좋아요 수정
//* params: { postId: string, userId: string }
router.put("/toggle/like/:postId/:userId", PostController.togglePostLike);

//* desc 포스트의 북마드 수정
//* params: { postId: string, userId: string }
router.put(
  "/toggle/bookmark/:postId/:userId",
  PostController.togglePostBookmark
);

//* desc 새 포스트 생성
//* body: { title: string, content: string, previewImage?: string, authorId: string }
router.post("/", PostController.createPost);

//* desc 포스트 내용 업데이트
//* body: { title: string, content: string, previewImage?: string }, params: { id: string }
router.put("/update/:id", PostController.updatePost);

//* desc 포스트 제거
//* params: { id: string }
router.delete("/delete/:id", PostController.deletePost);

export default router;
