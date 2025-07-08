require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogify')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

// Authentication middleware
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
app.use(checkForAuthenticationCookie("token"));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

// Routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Home route
app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .populate('createdBy');
            
        res.render("home", {
            user: req.user,
            blogs: allBlogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        user: req.user 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        user: req.user 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});