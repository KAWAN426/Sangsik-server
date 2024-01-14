import { Router } from "express";
import * as PostController from "@/controllers/postController";

const router = Router();

router.get("/:id", PostController.getPostOne);
router.get("/latest", PostController.getLatestPosts);
router.get("/popular", PostController.getPopularPosts);
router.get("/user/likes/:userId", (req, res) =>
  PostController.getPopularPosts(req, res, { authorId: req.params.userId })
);

//* params { postId: string, userId: string }
router.get("/user/:userId", (req, res) =>
  PostController.getLatestPosts(req, res, { authorId: req.params.userId })
);

//* params { postId: string, userId: string }
router.put("/toggle/like/:postId/:userId", PostController.togglePostLike);

//* params { postId: string, userId: string }
router.put(
  "/toggle/bookmark/:postId/:userId",
  PostController.togglePostBookmark
);

//* body { title: string, content: string, previewImage?: string, authorId: string }
router.post("/", PostController.createPost);

export default router;
