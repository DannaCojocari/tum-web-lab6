import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swagger from "./src/swagger.js";
const { swaggerUi, swaggerSpec } = swagger;

import tokenRouter from "./src/routes/token.js";
import authRouter from "./src/routes/auth.js";
import destinationsRouter from "./src/routes/destinations.js";
import itinerariesRouter from "./src/routes/itineraries.js";
import activitiesRouter from "./src/routes/activities.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/token", tokenRouter);
app.use("/api/auth", authRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/itineraries", itinerariesRouter);
app.use("/api/activities", activitiesRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Wanderlist API is running 🌍" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});