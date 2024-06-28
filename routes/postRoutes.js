import express from "express";
import { getPosts, getPost, newPost, updatePost, deletePost } from "../controllers/postControllers.js";
import { checkAndRenewToken, isAdmin } from "../middleware/validate-token.js";

const router = express.Router();

router.post("/create", checkAndRenewToken, isAdmin, newPost);
router.get("/all-posts", getPosts);
router.get("/single-post/:id", getPost);
router.patch("/update/:id", checkAndRenewToken, updatePost);
router.delete("/delete/:postId", checkAndRenewToken, isAdmin, deletePost);

export default router;