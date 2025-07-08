const express = require("express");
const { Router } = require("express");
const User = require('../models/user');

const router = Router();

// Render signin page
router.get('/signin', (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render("signin", { error: null });
});

// Render signup page
router.get('/signup', (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render("signup");
});

// Handle user signup
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { 
                error: 'Email already in use' 
            });
        }

        // Create new user
        await User.create({ fullName, email, password });
        return res.redirect("/user/signin");
    } catch (error) {
        console.error(error);
        return res.render('signup', { 
            error: 'Error creating user' 
        });
    }
});

// Handle user signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        
        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).redirect("/");
    } catch (error) {
        console.error(error);
        return res.render('signin', {
            error: "Incorrect email or password",
        });
    }
});

// Handle user logout
router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect('/');
});

module.exports = router;