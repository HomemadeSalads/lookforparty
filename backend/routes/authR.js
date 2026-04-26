import express from "express";
import { getAuth, login, logout, register } from "../controller/auth.js";

const router = express.Router();

router.get("/", getAuth);

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;