import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import headerRoutes from "./routes/header.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";

import connectDB from "./config/DataBaseConnection.js";

dotenv.config();

const app = express();

// ✅ CORS configuration (for Render + local dev)
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://sareesansaaar.onrender.com", // your live site
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Health check route (Render uses this)
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);

// ✅ Connect Database and Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
};

startServer();
