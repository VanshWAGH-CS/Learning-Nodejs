const mongoose = require("mongoose");

async function connectMongoDb(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

module.exports = {
  connectMongoDb,
};
