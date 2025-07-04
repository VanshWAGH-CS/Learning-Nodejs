const express = require("express");
const { connectMongoDb } = require("./connection");
const userRouter = require("./routes/user");
const { logReqRes } = require("./middlewares/index");

const app = express();
const PORT = 8000;

// ✅ MongoDB connection
connectMongoDb("mongodb://127.0.0.1:27017/youtube_App_1");

// ✅ Middlewares
app.use(express.json());
app.use(logReqRes("log.txt"));

// ✅ Routes
app.use("/user", userRouter);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
