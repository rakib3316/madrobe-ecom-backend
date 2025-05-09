import express from "express";
import { blogControllers } from "./blog.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.post("/create", blogControllers.createBlog);
router.get("/", auth(), blogControllers.getBlogs);

export const blogRoutes = router;
