const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");

const userRouter = express.Router();

const upload = multer({ dest: "uploads/" });

userRouter.post("/register", upload.single("profileImage"), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user.id }, process.env.SECRET_KEY , { expiresIn: "1d" }),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" }),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user by ID
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude password from response
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout a user
userRouter.post("/logout", (req, res) => {
  try {
    // Since logout is handled client-side (by clearing localStorage), we simply return a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during logout." });
  }
});

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from response
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
