// src/models/userModel.ts
import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Interface for the basic user data
interface IUser {
  name: string;
  email: string;
  password: string;
}

// Interface for the custom methods we will add to the document
interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface for the Mongoose document, combining the data, methods, and Mongoose's Document type
interface IUserDocument extends IUser, IUserMethods, Document {
  _id: Types.ObjectId;
}
// Interface for the Mongoose model (for static methods, if any)
type IUserModel = Model<IUserDocument>;

// --- SCHEMA DEFINITION ---

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// --- MIDDLEWARE & METHODS ---

// Middleware to hash password before saving a new user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the DB
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- MODEL CREATION ---

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;
