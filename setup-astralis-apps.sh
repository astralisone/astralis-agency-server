#!/bin/bash

# App names
BACKEND_NAME="astralis-backend"
FRONTEND_NAME="astralis-frontend"

# App directories
BACKEND_DIR="/home/ftpuser/ftp/files/astralis-agency-server"
FRONTEND_DIR="/home/ftpuser/ftp/files/astralis-agency-frontend"

# Backend build and run config
BACKEND_ENTRY="$BACKEND_DIR/dist/index.js"
BACKEND_BUILD_COMMAND="npm run build"

# Frontend run command
FRONTEND_COMMAND="npm run dev"

echo "[+] Installing PM2 globally..."
npm install -g pm2

# Backend Setup
echo "[+] Setting up backend..."
cd "$BACKEND_DIR" || { echo "❌ Backend directory not found"; exit 1; }

echo "[+] Installing backend dependencies..."
npm install

echo "[+] Building backend..."
$BACKEND_BUILD_COMMAND || { echo "❌ Backend build failed"; exit 1; }

if [[ ! -f "$BACKEND_ENTRY" ]]; then
  echo "❌ Backend entry file not found at $BACKEND_ENTRY"
  exit 1
fi

echo "[+] Starting backend with PM2..."
pm2 start "$BACKEND_ENTRY" --name "$BACKEND_NAME"
