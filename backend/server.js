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

// NEW: Agent proxy routes
// Helper function for proxying requests to Flask
const proxyToFlask = (req, res, endpoint) => {
    const proxyUrl = new URL(`http://localhost:5000${endpoint}`);
    console.log('Proxying agent request to:', proxyUrl.href);

    const requestMethod = req.method.toLowerCase();
    const options = {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            ...req.headers
        }
    };

    if (requestMethod === 'post' || requestMethod === 'put') {
        const postData = JSON.stringify(req.body);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
        
        const flaskReq = http.request(proxyUrl, options, (flaskRes) => {
            let data = '';
            flaskRes.on('data', (chunk) => data += chunk);
            flaskRes.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    res.status(flaskRes.statusCode).json(responseData);
                } catch (error) {
                    console.error('Error parsing Flask agent response:', error);
                    res.status(500).json({ 
                        error: 'Failed to parse agent response', 
                        details: error.message,
                        rawResponse: data
                    });
                }
            });
        });

        flaskReq.on('error', (error) => {
            console.error('Agent proxy error:', error.message);
            res.status(503).json({ 
                error: 'Agent service unavailable', 
                details: error.message 
            });
        });

        flaskReq.write(postData);
        flaskReq.end();
    } else {
        http.get(proxyUrl.href, (flaskRes) => {
            let data = '';
            flaskRes.on('data', (chunk) => data += chunk);
            flaskRes.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    res.status(flaskRes.statusCode).json(responseData);
                } catch (error) {
                    console.error('Error parsing Flask agent response:', error);
                    res.status(500).json({ 
                        error: 'Failed to parse agent response', 
                        details: error.message,
                        rawResponse: data
                    });
                }
            });
        }).on('error', (error) => {
            console.error('Agent proxy error:', error.message);
            res.status(503).json({ 
                error: 'Agent service unavailable', 
                details: error.message 
            });
        });
    }
};

// Agent status endpoint
app.get('/api/agent/status', (req, res) => {
    proxyToFlask(req, res, '/api/agent/status');
});

// Agent query endpoint
app.post('/api/agent/query', (req, res) => {
    proxyToFlask(req, res, '/api/agent/query');
});

// Agent suggestions endpoint
app.get('/api/agent/suggestions', (req, res) => {
    proxyToFlask(req, res, '/api/agent/suggestions');
});

// Health check endpoint (proxy to Flask)
app.get('/health', (req, res) => {
    const proxyUrl = new URL('http://localhost:5000/health');
    console.log('Proxying health check to:', proxyUrl.href);

    http.get(proxyUrl.href, (flaskRes) => {
        let data = '';
        flaskRes.on('data', (chunk) => data += chunk);
        flaskRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                res.json(responseData);
            } catch (error) {
                res.status(500).json({ 
                    error: 'Health check failed', 
                    details: error.message 
                });
            }
        });
    }).on('error', (error) => {
        console.error('Health check proxy error:', error.message);
        res.status(503).json({ 
            error: 'Backend service unavailable', 
            details: error.message 
        });
    });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Agent endpoints available:');
    console.log('- GET /api/agent/status');
    console.log('- POST /api/agent/query');
    console.log('- GET /api/agent/suggestions');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });   
});
