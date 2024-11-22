import express from "express";
import {
  registerLibrarian,
  loginLibrarian,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerLibrarian);
router.post("/login", loginLibrarian);

export default router;
