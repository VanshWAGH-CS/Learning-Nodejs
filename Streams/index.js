const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib"); // Built-in module for compression

const app = express();
const PORT = 8000;

// Route: stream and compress file using gzip
app.get("/", (req, res) => {
    const filePath = path.resolve(__dirname, "sample.txt");

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send("File not found");
            return;
        }

        // Set headers to tell browser it's gzipped content
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", "text/plain");

        // Create read stream → gzip stream → response
        const readStream = fs.createReadStream(filePath, "utf-8");
        const gzipStream = zlib.createGzip(); // Compress stream

        // Pipe the file through gzip and into response
        readStream
            .pipe(gzipStream)
            .pipe(res)
            .on("error", (error) => {
                console.error("Streaming error:", error);
                res.status(500).send("Error while streaming the file.");
            });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
