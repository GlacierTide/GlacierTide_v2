// backend/controllers/authController.js
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).send("Email already exists");

    const newUser = new User({ firstname, lastname, email, password });
    await newUser.save();
    res.status(201).send("Signup Successful");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Error in signup");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).send("Invalid email or password");

    res.status(200).send("Login Successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Error in login");
  }
};
