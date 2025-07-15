// src/controllers/characterController.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Character from "../models/characterModel";

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

// @desc    Create a new character
// @route   POST /api/characters
// @access  Private
const createCharacter = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    race,
    characterClass,
    stats,
    proficiencies,
    spells,
    background,
    alignment,
    hitDie,
  } = req.body;

  if (
    !name ||
    !race ||
    !characterClass ||
    !background ||
    !alignment ||
    !stats ||
    !hitDie
  ) {
    res.status(400);
    throw new Error(
      "Please provide all required character fields: name, race, class, background, alignment, and stats."
    );
  }

  const conModifier = calculateModifier(stats.constitution);
  const startingHp = hitDie + conModifier;

  const character = await Character.create({
    user: req.user!._id, // req.user is guaranteed to exist by the 'protect' middleware
    name,
    race,
    characterClass,
    stats,
    proficiencies,
    spells,
    background,
    alignment,
    level: 1,
    maxHp: startingHp,
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

const deleteCharacter = asyncHandler(async (req: Request, res: Response) => {
  const character = await Character.findById(req.params.id);

  if (!character) {
    res.status(404);
    throw new Error("Character not found");
  }

  // Security Check: Ensure the user owns this character
  if (character.user.toString() !== req.user!._id) {
    res.status(401);
    throw new Error("Not authorized to delete this character");
  }

  await character.deleteOne();

  res.status(200).json({ message: "Character deleted successfully" });
});

const updateCharacter = asyncHandler(async (req: Request, res: Response) => {
  const character = await Character.findById(req.params.id);

  if (!character) {
    res.status(404);
    throw new Error("Character not found");
  }

  if (character.user.toString() !== req.user!._id) {
    res.status(401);
    throw new Error("Not authorized to update this character");
  }

  // Use a more robust check to allow for "falsy" values like "" or 0
  character.name = req.body.name ?? character.name;
  character.race = req.body.race ?? character.race;
  character.characterClass =
    req.body.characterClass ?? character.characterClass;
  character.stats = req.body.stats ?? character.stats;
  character.proficiencies = req.body.proficiencies ?? character.proficiencies;
  character.spells = req.body.spells ?? character.spells;
  character.background = req.body.background ?? character.background;
  character.alignment = req.body.alignment ?? character.alignment;

  const updatedCharacter = await character.save();
  res.status(200).json(updatedCharacter);
});

const levelUpCharacter = asyncHandler(async (req: Request, res: Response) => {
  const { hpRoll } = req.body; // The new HP roll from the frontend
  const character = await Character.findById(req.params.id);

  if (!character || character.user.toString() !== req.user!._id) {
    res.status(404);
    throw new Error("Character not found or not authorized");
  }
  if (character.level >= 20) {
    res.status(400);
    throw new Error("Character is already at max level");
  }

  const conModifier = calculateModifier(character.stats.constitution);
  const hpGain = hpRoll + conModifier;

  character.level += 1;
  character.maxHp += hpGain;

  const updatedCharacter = await character.save();
  res.status(200).json(updatedCharacter);
});

export {
  createCharacter,
  getMyCharacters,
  getCharacterById,
  deleteCharacter,
  updateCharacter,
  levelUpCharacter,
};
