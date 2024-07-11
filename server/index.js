import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import { accessValidation } from "./middleware/accessValidation.js";
import { refreshToken } from "./controllers/resfreshToken.js";

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/users", accessValidation, userRoutes);
app.use("/auth", authRoutes);
app.get("/token", refreshToken);

app.listen(process.env.PORT || 4000, () =>
    console.log("Server running on port: " + process.env.PORT)
);
