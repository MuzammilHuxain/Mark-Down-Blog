const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Set user session
        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.render('login', { error: 'Something went wrong' });
    }
});

// Handle signup
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            fullName,
            email,
            password
        });

        await user.save();
        
        // Set user session
        req.session.userId = user._id;
        res.redirect('/');
    } catch (error) {
        res.render('signup', { error: 'Something went wrong' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router; 