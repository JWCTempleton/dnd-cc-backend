// src/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

// The global type declaration remains the same.
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
      };
    }
  }
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: string;
        };

        const userFromDb = await User.findById(decoded.userId).select(
          "-password"
        );

        if (userFromDb) {
          // --- THE FIX IS HERE ---
          // Convert the Mongoose document to a plain JavaScript object.
          const userObject = userFromDb.toObject();

          // Now, TypeScript can reliably infer the types from the plain object.
          req.user = {
            _id: userObject._id.toString(),
            name: userObject.name,
            email: userObject.email,
          };

          next(); // Proceed to the next middleware/controller
        } else {
          res.status(401);
          throw new Error("Not authorized, user not found");
        }
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export { protect };
