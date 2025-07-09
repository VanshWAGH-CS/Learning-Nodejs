const cluster = require("cluster");
const express = require("express");
const os = require("os");

// Get number of CPU cores
const totalCPUs = os.cpus().length;

// Check if this is the primary/master process
if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    // Fork workers equal to the number of CPU cores
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork(); // Create a new worker process
    }

    // Listen for worker exit events (optional)
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Optionally restart the worker
        // cluster.fork();
    });
} else {
    // This is a worker process
    const app = express(); // Create an Express app instance
    const PORT = 8000;

    // Define a simple route
    app.get("/", (req, res) => {
        res.json({ message: `Hello from Express Server (Worker PID: ${process.pid})` });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
    });
}
