import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running!" });
});

// ✅ Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name: name || email.split('@')[0] }
      }
    });

    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ 
      success: true, 
      message: "Signup successful! Check your email.", 
      user: data.user 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ 
      success: true, 
      message: "Login successful!", 
      user: data.user,
      session: data.session
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get current user
app.get("/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/auth/callback", (req, res) => {
  res.send("✅ Email confirmed! You can now log in.");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on http://localhost:${process.env.PORT}`);
  console.log(`📋 Health: http://localhost:${process.env.PORT}/health`);
});
