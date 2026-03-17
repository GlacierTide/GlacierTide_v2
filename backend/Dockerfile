# ── Backend Dockerfile ──────────────────────────────────────────────────────
# This single image runs BOTH the Node/Express server (port 8800)
# AND the Python Flask ML server (port 5000) side-by-side.
# Both are started together via the start.sh entrypoint.

FROM node:20-slim

# Install Python 3 and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Install Node dependencies ──────────────────────────────────────────────
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# ── Install Python dependencies ────────────────────────────────────────────
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# ── Copy all backend source files ─────────────────────────────────────────
COPY . .

# ── Expose both ports ─────────────────────────────────────────────────────
EXPOSE 8800 5000

# ── Start both servers ────────────────────────────────────────────────────
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ["./start.sh"]
