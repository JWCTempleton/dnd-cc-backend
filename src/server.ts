import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import characterRoutes from "./routes/characterRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "https://your-dnd-app.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Main Routes
app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Error Handling Middleware (should be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
