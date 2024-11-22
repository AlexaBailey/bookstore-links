import express from "express";
import { getVisitors } from "../controllers/visitors.controller.js";

const router = express.Router();
router.get("/", getVisitors);

export default router;
