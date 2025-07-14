// src/routes/characterRoutes.ts
import express from "express";
import {
  createCharacter,
  getMyCharacters,
  getCharacterById,
} from "../controllers/characterController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Chain requests for the same route together
router.route("/").post(protect, createCharacter).get(protect, getMyCharacters);

router.route("/:id").get(protect, getCharacterById);

export default router;
