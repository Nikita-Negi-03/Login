const User=require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import CORS middleware

var functions = {
    registerUser : async(req,res)=>{
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
    
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ where: { username } });
    
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Insert new user into the database
            await User.create({
                username: username,
                password_hash: hashedPassword
            });
    
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error during sign up:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    login : async (req, res) => {
        const { username, password } = req.body;
    
        try {
            // Find the user by username using Sequelize
            const user = await User.findOne({ where: { username } });
    
            if (!user) {
                return res.status(400).send('User not found');
            }
    
            const now = new Date();
            console.log("new Date(user.blocked_until)", new Date(user.blocked_until), now, new Date(user.blocked_until) > now);
    
            if (user.blocked_until && new Date(user.blocked_until) > now) {
                return res.status(403).send('Your account is blocked for 24 hours. Please try again later.');
            }
    
            // Compare the password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password_hash);
    
            if (isMatch) {
                // Reset login attempts and blocked_until on successful login
                await user.update({
                    login_attempts: 0,
                    blocked_until: null
                });
    
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                return res.json({ token });
            } else {
                // Increment login attempts
                await user.increment('login_attempts');
    
                // If login attempts exceed threshold, set blocked_until to 24 hours from now
                if (user.login_attempts + 1 >= 2) {
                    await user.update({
                        blocked_until: new Date(now.getTime() + 24 * 60 * 60 * 1000) // Block for 24 hours
                    });
                }
    
                return res.status(400).send('Incorrect password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal server error');
        }
    }
}

module.exports = functions