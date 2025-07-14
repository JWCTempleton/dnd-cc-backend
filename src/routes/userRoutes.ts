import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // No protect middleware needed here
router.get("/profile", protect, getUserProfile); // 'protect' is the gatekeeper

export default router;
