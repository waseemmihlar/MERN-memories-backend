import express from "express";
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostbySearch,
  commentPost,
  userPosts

} from "../controller/posts.js";
import auth from "../middle_wear/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostbySearch);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likepost", auth, likePost);
router.post("/:id/commentpost", auth,commentPost);
router.get("/:id/userposts",auth,userPosts);
export default router;
