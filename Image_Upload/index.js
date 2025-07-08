const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const PORT = 8000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // for serving files

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
    return res.render("homepage");
});

app.post("/upload", upload.single("myfile"), (req, res) => {
    console.log(req.file);  // Details of the uploaded file
    res.send("File uploaded successfully!");
});

// Start server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
