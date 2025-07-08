const { Schema, model } = require('mongoose');

/**
 * Comment Schema
 */
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, { timestamps: true });

// Create and export Comment model
const Comment = model("comment", commentSchema);
module.exports = Comment;