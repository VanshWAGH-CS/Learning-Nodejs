const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Initialize express app and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server with HTTP server
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log("A user connected");

    // Listen for custom 'user-message' event from the client
    socket.on('user-message', message => {
        // Broadcast the received message to all connected clients
        io.emit('message', message);
    });

    // Optional: Handle disconnect
    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
});

// Serve static files from the 'public' folder
app.use(express.static(path.resolve("./public")));

// Route: Serve index.html for the root path
app.get('/', (req, res) => {
    return res.sendFile(path.resolve("./public/index.html"));
});

// Start the server on port 9000
server.listen(9000, () => console.log("Server started at port 9000"));
