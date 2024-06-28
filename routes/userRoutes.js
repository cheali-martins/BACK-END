import express from "express";
import { getUser, getUsers, login, logout, register, validateUser } from "../controllers/userControllers.js";
import { checkAndRenewToken } from "../middleware/validate-token.js";

const router = express.Router();

router.post("/create", register);
router.post("/login", login);
router.get("/all-users", checkAndRenewToken, getUsers);
router.get("/single-user/:id", checkAndRenewToken, getUser);
router.get("/validate-user", checkAndRenewToken, validateUser);
router.get("/logout", checkAndRenewToken, logout)

export default router;