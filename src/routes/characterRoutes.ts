// src/routes/characterRoutes.ts
import express from "express";
import {
  createCharacter,
  getMyCharacters,
  getCharacterById,
  deleteCharacter,
  updateCharacter,
  levelUpCharacter,
} from "../controllers/characterController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Chain requests for the same route together
router.route("/").post(protect, createCharacter).get(protect, getMyCharacters);

router
  .route("/:id")
  .get(protect, getCharacterById)
  .put(protect, updateCharacter)
  .delete(protect, deleteCharacter);

router.route("/:id/levelup").post(protect, levelUpCharacter);

export default router;
