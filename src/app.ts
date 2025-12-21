import express from "express";
import "./config/env"; // Initialize environment variables
import authRoutes from "./routers/auth.routes";
import linkedinRoutes from "./routers/linkedin.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./config/swagger";
import { env } from "./config/env";

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation (only in development or when explicitly enabled)
if (env.NODE_ENV === "development" || process.env.ENABLE_SWAGGER === "true") {
  setupSwagger(app);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/linkedin", linkedinRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware (must be last)
app.use(errorHandler);
