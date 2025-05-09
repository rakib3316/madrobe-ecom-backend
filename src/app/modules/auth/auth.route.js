import express from "express";
import { authControllers } from "./auth.controller.js";

const router = express.Router();

router.post("/sign-up", authControllers.singupUser);
router.post("/login", authControllers.loginUser);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password", authControllers.resetPassword);
router.get("/refresh-token", authControllers.refreshToken);

export const authRoutes = router;
