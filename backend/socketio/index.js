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

// Handle connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

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
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(8001, () => {
    console.log("Server is running on port 8001");
});
