
const express = require("express");
const multer = require("multer");
const Chat = require("../models/Chat");

// Initialize router
const chatRouter = express.Router();

// Configure multer for handling media uploads
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage });

// Handle sending a new message
chatRouter.post("/send", upload.single("media"), async (req, res) => {
  const { sender, receiver, message } = req.body;
  let mediaUrl = null;

  // Check if media exists
  if (req.file) {
    // Example: Save media to cloud storage or local file system
    mediaUrl = `uploads/${req.file.originalname}`; // Replace with actual file upload logic
    console.log("Uploaded file:", req.file); // Debugging: Log the uploaded file
  }

  try {
    // Create a new chat entry
    const chat = await Chat.create({
      sender,
      receiver,
      message,
      media: mediaUrl,
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Handle fetching chats for a user
chatRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all chats where the user is either sender or receiver
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "name profileImage");
    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Handle fetching conversation between two users
chatRouter.get("/conversation/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;

  try {
    // Fetch chats between the two users
    const conversation = await Chat.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).populate("sender receiver", "name profileImage");

    res.json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = chatRouter;
