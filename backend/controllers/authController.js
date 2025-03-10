const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating a random token
const sgMail = require('@sendgrid/mail'); // SendGrid mail package

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper function to send verification email
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:${process.env.PORT || 8800}/api/auth/verify-email?token=${token}`;
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Your verified sender email
        subject: 'Verify Your Email Address',
        text: `Please verify your email by clicking this link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking this link: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};

exports.signup = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Generate a random verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = new User({
            firstname,
            lastname,
            email,
            password,
            verificationToken,
        });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Signup successful. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error in signup' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error in login' });
    }
};

// New controller for email verification
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token after verification
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Error verifying email' });
    }
};