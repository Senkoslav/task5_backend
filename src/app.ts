import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://task5-frontend-opal.vercel.app",
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "User Management API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`User management: http://localhost:${PORT}/api/users`);
});

export default app;
