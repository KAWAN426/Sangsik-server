import { Router } from "express";
import * as PostController from "@/controllers/postController";

const router = Router();

router.get("/:id", PostController.getPostOne);
router.get("/latest", PostController.getLatestPosts);
router.get("/popular", PostController.getPopularPosts);
router.get("/user/likes/:userId", (req, res) =>
  PostController.getPopularPosts(req, res, { authorId: req.params.userId })
);
router.get("/user/:userId", (req, res) =>
  PostController.getLatestPosts(req, res, { authorId: req.params.userId })
);

router.get("/toggle/like/:postId/:userId", PostController.togglePostLike);
router.get(
  "/toggle/bookmark/:postId/:userId",
  PostController.togglePostBookmark
);

export default router;
