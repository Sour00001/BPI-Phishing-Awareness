import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

console.log("Loading MongoDB URI:", process.env.MONGODB_URI ? "Found" : "Not Found");

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/users_db";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const loginAuditSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password_attempt: { type: String, required: true },
  login_time: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const LoginAudit = mongoose.model('LoginAudit', loginAuditSchema);

// Seed admin user
async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'admin123' });
    }
  } catch (e) {
    console.error("Error seeding admin error", e);
  }
}

seedAdmin();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      const newUser = await User.create({ username, password });
      res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (error: any) {
      if (error.code === 11000) { // MongoDB duplicate key error code
        res.status(409).json({ error: "Username already exists" });
      } else {
        console.error("Database error during registration:", error);
        res.status(500).json({ error: "Database error" });
      }
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      // Log the login attempt
      await LoginAudit.create({ username, password_attempt: password });

      const user = await User.findOne({ username, password });

      if (user) {
        res.status(200).json({ message: "Login successful", username: user.username });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Database error during login:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/admin/audit", async (req, res) => {
    try {
      const logs = await LoginAudit.find().sort({ login_time: -1 }).lean();
      console.log("Found logs:", logs); // Debug line
      
      // Map _id to id for frontend compatibility
      const mappedLogs = logs.map(log => ({
        ...log,
        id: log._id.toString(),
      }));

      res.status(200).json(mappedLogs);
    } catch (error) {
      console.error("Database error fetching audit logs:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.delete("/api/admin/audit", async (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid request. 'ids' array is required." });
    }

    try {
      if (ids.length === 0) {
        return res.status(200).json({ message: "No logs deleted" });
      }
      
      await LoginAudit.deleteMany({ _id: { $in: ids } });
      
      res.status(200).json({ message: "Logs deleted successfully" });
    } catch (error) {
      console.error("Database error deleting audit logs:", error);
      res.status(500).json({ error: "Database error" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
