import express from "express";
import { upload } from "../../../utils/multer.js";
import auth from "../../middlewares/auth.js";
import { categoryControllers } from "./category.controller.js";

const router = express.Router();

// router.get("/", studentControllers.getStudents);
// router.post("/query/get", studentControllers.getQueryStudents);
router.post(
  "/create",
  auth(),
  upload.single("file"),
  categoryControllers.createCategory
);
// router.post("/update", studentControllers.updateStudent);
// router.post("/delete", studentControllers.deleteStudent);

export const categoryRoutes = router;
