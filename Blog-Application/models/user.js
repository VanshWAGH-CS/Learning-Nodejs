const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require('crypto');
const { createTokenForUser } = require("../services/authentication");

/**
 * User Schema
 */
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true });

/**
 * Pre-save hook to hash password before saving
 */
userSchema.pre('save', function (next) {
    const user = this;
    
    // Only hash the password if it has been modified
    if (!user.isModified("password")) return next();

    try {
        // Generate salt and hash the password
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = createHmac('sha256', salt)
            .update(user.password)
            .digest("hex");
        
        this.salt = salt;
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Static method to match password and generate token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<string>} JWT token
 */
userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    // Hash the provided password with the stored salt
    const userProvidedHash = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    // Compare hashes
    if (user.password !== userProvidedHash) {
        throw new Error('Invalid Password');
    }

    // Generate and return token
    const token = createTokenForUser(user);
    return token;
});

// Create and export User model
const User = model('user', userSchema);
module.exports = User;