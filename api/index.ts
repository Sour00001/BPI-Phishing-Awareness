import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection singleton
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/users_db";

let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose;
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Define Mongoose Schemas (Define only once)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const loginAuditSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password_attempt: { type: String, required: true },
  login_time: { type: Date, default: Date.now }
});

// Use existing models if they exist (crucial for Vercel/serverless)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const LoginAudit = mongoose.models.LoginAudit || mongoose.model('LoginAudit', loginAuditSchema);

// Seed admin user
async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'admin123' });
    }
  } catch (e) {
    console.error("Error seeding admin", e);
  }
}

const app = express();
app.use(express.json());

// Middleware to ensure DB connection
const ensureDbConnected = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
};

// API Routes
app.post("/api/register", ensureDbConnected, async (req, res) => {
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

app.post("/api/login", ensureDbConnected, async (req, res) => {
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

app.get("/api/admin/audit", ensureDbConnected, async (req, res) => {
  try {
    const logs = await LoginAudit.find().sort({ login_time: -1 }).lean();
    
    // Map _id to id for frontend compatibility
    const mappedLogs = logs.map((log: any) => ({
      ...log,
      id: log._id.toString(),
    }));

    res.status(200).json(mappedLogs);
  } catch (error) {
    console.error("Database error fetching audit logs:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/admin/audit", ensureDbConnected, async (req, res) => {
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

// Serve static files from the frontend build directory
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Catch-all route to serve the frontend index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Seed admin on start if connected
connectToDatabase().then(() => seedAdmin()).catch(console.error);

export default app;
