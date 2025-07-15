// src/models/characterModel.ts
import mongoose, { Document, Model, Types } from "mongoose";

// --- TYPE DEFINITIONS ---
interface ICharacter {
  user: Types.ObjectId; // Reference to the User who owns this character
  name: string;
  race: string; // Storing the 'index' from the D&D API, e.g., "elf"
  characterClass: string; // Using "characterClass" to avoid conflict with JS 'class' keyword
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencies: string[];
  spells: string[];
  background: string;
  alignment: string;
  level: number;
  maxHp: number;
}

interface ICharacterDocument extends ICharacter, Document {
  _id: Types.ObjectId;
}

type ICharacterModel = Model<ICharacterDocument>;

// --- SCHEMA DEFINITION ---
const characterSchema = new mongoose.Schema<
  ICharacterDocument,
  ICharacterModel
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This creates the link to the User model
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    race: {
      type: String,
      required: true,
    },
    characterClass: {
      type: String,
      required: true,
    },
    stats: {
      strength: { type: Number, default: 10 },
      dexterity: { type: Number, default: 10 },
      constitution: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 },
      charisma: { type: Number, default: 10 },
    },
    proficiencies: { type: [String], default: [] },
    spells: { type: [String], default: [] },
    background: { type: String, required: true },
    alignment: { type: String, required: true },
    level: { type: Number, default: 1 },
    maxHp: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

// --- MODEL CREATION ---
const Character = mongoose.model<ICharacterDocument, ICharacterModel>(
  "Character",
  characterSchema
);

export default Character;
