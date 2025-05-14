import express from "express";
import { upload } from "../../../utils/multer.js";
import auth from "../../middlewares/auth.js";
import { CategoryControllers } from "./category.controller.js";

const router = express.Router();

// router.post("/query/get", studentControllers.getQueryStudents);
router.get("/", auth(), CategoryControllers.getCategories);
router.post(
  "/create",
  auth(),
  upload.single("file"),
  CategoryControllers.createCategory
);
// router.post("/update", studentControllers.updateStudent);
// router.post("/delete", studentControllers.deleteStudent);

export const categoryRoutes = router;
