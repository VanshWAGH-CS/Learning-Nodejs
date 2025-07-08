const { Schema, model } = require('mongoose');

/**
 * Blog Schema
 */
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
        default: '/images/default-blog.png',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, { timestamps: true });

// Create and export Blog model
const Blog = model("blog", blogSchema);
module.exports = Blog;