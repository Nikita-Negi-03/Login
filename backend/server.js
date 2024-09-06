require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import CORS middleware
const db = require('./db');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true // Enable if you need to send cookies/auth tokens
  }));
app.use(express.json());
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Parameterized query for selecting user
    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
        const { rows } = await db.query(query, [username]);

        if (rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = rows[0];
        const now = new Date();
        console.log("new Date(user.blocked_until)",new Date(user.blocked_until),now,new Date(user.blocked_until)<now)
        if (user.blocked_until && new Date(user.blocked_until) > now) {
            return res.status(403).send('Your account is blocked for 24 hours. Please try again later.');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            // Reset login attempts on successful login
            const resetQuery = 'UPDATE users SET login_attempts = 0, blocked_until = NULL WHERE id = $1';
            await db.query(resetQuery, [user.id]);
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            return res.json({ token });
        } else {
            // Increment login attempts on failure
            const updateQuery = 'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = $1';
            await db.query(updateQuery, [user.id]);

            // Check if the user should be blocked
            const updateBlockedUntilQuery = `
                UPDATE users 
                SET blocked_until = NOW() + INTERVAL '5 minute' 
                WHERE login_attempts >= 2 AND id = $1
            `;
            await db.query(updateBlockedUntilQuery, [user.id]);

            return res.status(400).send('Incorrect password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
    
      try {
        // Check if the user already exists
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
          return res.status(400).json({ error: 'Username already taken' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert new user into the database
        await db.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
          [username, hashedPassword]
        );
    
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

// Additional routes (e.g., user registration) can be added here.

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
