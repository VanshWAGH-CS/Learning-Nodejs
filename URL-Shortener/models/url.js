const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [
        {
            timestamp: {
                type: Number,
                required: true,
            }
        }
    ],
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",  // Corrected from "users"
    }
}, {
    timestamps: true,
});

const URL = mongoose.model('URL', urlSchema);
module.exports = URL;
