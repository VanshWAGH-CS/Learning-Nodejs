const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Blog = require('../models/blog');
const Comment = require("../models/comment");

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const userDir = path.join(uploadsDir, req.user._id.toString());
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Render add new blog page
router.get("/add-new", (req, res) => {
    if (!req.user) return res.redirect('/user/signin');
    return res.render("addBlog", {
        user: req.user,
    });
});

// Get single blog with comments
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        if (!blog) return res.status(404).send('Blog not found');

        const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
        
        return res.render('blog', {
            user: req.user,
            blog,
            comments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
});

// Add comment to blog
router.post('/comment/:blogId', async (req, res) => {
    if (!req.user) return res.redirect('/user/signin');
    
    try {
        await Comment.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error adding comment');
    }
});

// Create new blog
router.post("/add-new", upload.single('coverImage'), async (req, res) => {
    if (!req.user) return res.redirect('/user/signin');
    
    try {
        const { title, body } = req.body;
        
        if (!req.file) {
            return res.status(400).send('Cover image is required');
        }

        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`
        });
        
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error creating blog');
    }
});

module.exports = router;