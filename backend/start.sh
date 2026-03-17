#!/bin/sh
# start.sh - Runs both Node.js and Python Flask servers in a single container

echo "=========================================="
echo "  Starting GlacierTide Backend Services"
echo "=========================================="

# Start Python Flask ML server in the background
echo "🐍 Starting Python ML server on port 5000..."
python3 ml_server.py &
FLASK_PID=$!

# Give Flask a moment to start up before Node tries to connect to it
sleep 3

# Start Node.js Express server in the foreground
echo "🟢 Starting Node.js Express server on port 8800..."
node server.js

# If Node exits, kill Flask too
kill $FLASK_PID
