const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const URL = require('./models/url');
const path = require('path');

const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', staticRoute);
app.use('/url', urlRoute);

// Redirect handler
app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        }
      }
    },
    { new: true }
  );

  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
