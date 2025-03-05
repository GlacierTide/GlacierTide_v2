require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// const Event = require('./models/Events');

const app = express();
const PORT = process.env.PORT || 8800;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Update this if you deploy the frontend elsewhere
}));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

const db = mongoose.connection;

db.on('error', (error) => console.error("Error in connecting to database:", error));
db.once('open', () => console.log("Connected to MongoDB Atlas database"));

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Signup endpoint
app.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).send("Invalid email format");
    }

    try {
        const existingUser = await db.collection('users').findOne({ email: email });
        if (existingUser) {
            return res.status(409).send("Email already exists");
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            firstname,
            lastname,
            email,
            password: hashedPassword // Save hashed password
        };

        await db.collection('users').insertOne(data);
        console.log("Record inserted successfully");
        return res.status(200).send("Signup Successful");
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).send("Error inserting record");
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    try {
        const user = await db.collection('users').findOne({ email: email });

        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        // Compare the password with the stored hashed password
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            console.log("Login Success");
            return res.status(200).json({ message: "Login Successful", userId: user._id });
        } else {
            return res.status(401).send("Invalid email or password");
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send("Internal server error");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
