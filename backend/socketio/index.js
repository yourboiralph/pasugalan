const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Adjust if needed
        methods: ["GET", "POST"],
    },
});

let connectedUsers = new Set();

// Handle connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    connectedUsers.add(socket.id); // ✅ ADD THIS LINE
    io.emit("user_count", connectedUsers.size);
    // Listen for bet creation events
    socket.on("bet_created_from_frontend", (data) => {
        socket.join(data.roomId);
        io.emit("bet_created_from_backend", data);
    });

    socket.on("join_bet_from_frontend", (data) => {
        socket.join(data.roomId); // Join the room using roomId (which is the socket.id)
        console.log("Received join_bet_from_frontend");
        // Replace socket.emit with io.to(roomId).emit to send to all in the room
        io.to(data.roomId).emit("join_bet_from_backend", data);
        io.emit("delete_entry_done_from_backend", data);
    });

    socket.on("send_message_to_all_from_frontend", (data) => {
        io.emit("send_message_to_all_from_backend", data);
    });

    socket.on("delete_entry_from_frontend", (data) => {
        io.emit("delete_entry_from_backend", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        connectedUsers.delete(socket.id);
        io.emit("user_count", connectedUsers.size);
    });
});

server.listen(8001, () => {
    console.log("Server is running on port 8001");
});
