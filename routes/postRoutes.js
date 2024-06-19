import express from "express";
import { getPosts, getPost, newPost } from "../controllers/postControllers.js";
import { checkAndRenewToken } from "../middleware/validate-token.js";

const router = express.Router();

router.post("/create", checkAndRenewToken, newPost);
router.get("/all-posts", getPosts);
router.get("/single-post/:id", getPost)

export default router;