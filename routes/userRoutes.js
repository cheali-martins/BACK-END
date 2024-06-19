import express from "express"
import { getUser, getUsers, login, register } from "../controllers/userControllers.js";
import { checkAndRenewToken } from "../middleware/validate-token.js";

const router = express.Router();

router.post("/create", register);
router.post("/login", login);
router.get("/all-users", checkAndRenewToken, getUsers);
router.get("/single-user/:id", checkAndRenewToken, getUser);

export default router;