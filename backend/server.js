const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const { configDotenv } = require("dotenv");

configDotenv();

connectDB();

const app = express();
const server = http.createServer(app);

// Ensure correct CORS configuration
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-psi-bice.vercel.app", // Replace with your frontend origin
  methods: "GET, POST, PUT, DELETE", // Allowed methods
    credentials: true,
  },
});

// Middleware
// app.use(cors({ origin: "https://chat-app-psi-bice.vercel.app", credentials: true })); // Frontend origin

// Enable CORS
app.use(cors({
  origin: "https://chat-app-psi-bice.vercel.app", // Allow only your frontend
  methods: "GET, POST, PUT, DELETE", // Allowed methods
  credentials: true // Allow cookies if needed
}));
app.use(express.json());



// Routes
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Socket ID:", socket.id);

  // Listening for a message
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data); // Broadcast message to all clients
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
