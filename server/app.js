import "dotenv/config";

import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const allowedOrigin = process.env.ACCESS_CONTROL_ORIGIN;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigin, }));
app.use("/api/books", bookRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PageMark API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;