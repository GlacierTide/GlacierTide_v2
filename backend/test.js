require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); // Explicitly require http
const { URL } = require('url'); // For URL parsing

const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Updated to match new Vite port
    credentials: true,
}));

// Proxy requests to Flask API
app.get('/api/ml/predict/:seaName/:year', (req, res) => {
    const { seaName, year } = req.params;
    const proxyUrl = new URL(`http://localhost:5000/predict/${encodeURIComponent(seaName)}/${year}`);
    console.log('Proxying to:', proxyUrl.href);

    http.get(proxyUrl.href, (flaskRes) => {
        let data = '';
        flaskRes.on('data', (chunk) => data += chunk);
        flaskRes.on('end', () => {
            try {
                res.set('Content-Type', 'application/json'); // Ensure JSON content type
                res.json(JSON.parse(data));
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse response', details: error.message });
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