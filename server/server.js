import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/Webhooks.js";
import companyRoutes from "./routs/companyRouts.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routs/jobRoutes.js";
import userRoutes from "./routs/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import mongoose from "mongoose";

const app = express();

await connectDB();
await connectCloudinary();

app.use(cors({
  origin: ['http://localhost:5173', 'https://job-portal-frontend.onrender.com', 'https://job-portal-new-sigma-green.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

//routs
app.get("/", (req, res) => res.send("API Working"));

app.get("/test-db", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({ 
      success: true, 
      database: statusMap[dbStatus],
      dbName: mongoose.connection.name
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/debug-sentry", function mainHandler(req, res) { 
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
