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
app.use('/api/user', require("./routes/usersRoute"))

// Additional routes (e.g., user registration) can be added here.

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
