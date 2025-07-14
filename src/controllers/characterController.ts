// src/controllers/characterController.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Character from "../models/characterModel";

// @desc    Create a new character
// @route   POST /api/characters
// @access  Private
const createCharacter = asyncHandler(async (req: Request, res: Response) => {
  const { name, race, characterClass, stats } = req.body;

  if (!name || !race || !characterClass) {
    res.status(400);
    throw new Error("Please provide name, race, and class for the character");
  }

  const character = await Character.create({
    user: req.user!._id, // req.user is guaranteed to exist by the 'protect' middleware
    name,
    race,
    characterClass,
    stats,
  });

  res.status(201).json(character);
});

// @desc    Get all characters for the logged-in user
// @route   GET /api/characters
// @access  Private
const getMyCharacters = asyncHandler(async (req: Request, res: Response) => {
  const characters = await Character.find({ user: req.user!._id });
  res.status(200).json(characters);
});

const getCharacterById = asyncHandler(async (req: Request, res: Response) => {
  const character = await Character.findById(req.params.id);

  if (!character) {
    res.status(404);
    throw new Error("Character not found");
  }

  // Security Check: Make sure the character belongs to the logged-in user
  if (character.user.toString() !== req.user!._id) {
    res.status(401);
    throw new Error("Not authorized to access this character");
  }

  res.status(200).json(character);
});

// We'll add getById, update, and delete in a future step to keep this one focused.

export { createCharacter, getMyCharacters, getCharacterById };
