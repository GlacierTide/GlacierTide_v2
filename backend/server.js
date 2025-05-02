require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 8800;

// Allowed origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

const authController = require('./controllers/authController');

// Add the routes for signup and login
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/verify-email', authController.verifyEmail);

// Improved proxy requests to Flask API
app.get('/api/ml/predict/:seaName/:year', (req, res) => {
    const { seaName, year } = req.params;
    const proxyUrl = new URL(`http://localhost:5000/predict/${encodeURIComponent(seaName)}/${year}`);
    console.log('Proxying to:', proxyUrl.href);

    http.get(proxyUrl.href, (flaskRes) => {
        let data = '';
        flaskRes.on('data', (chunk) => data += chunk);
        flaskRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                res.set('Content-Type', 'application/json');
                res.json(responseData);
            } catch (error) {
                console.error('Error parsing Flask response:', error);
                res.status(500).json({ 
                    error: 'Failed to parse response', 
                    details: error.message,
                    rawResponse: data
                });
            }
        });
    }).on('error', (error) => {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Proxy failed', details: error.message });
    });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });   
});
