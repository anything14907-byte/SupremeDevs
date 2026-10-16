#!/usr/bin/env bash
# TinyFish Aegis - Quick Start Launch Script

PORT=${1:-8000}

echo "=========================================================="
echo "🛡️  LAUNCHING TINYFISH AEGIS DEFENSE ENGINE"
echo "=========================================================="
echo "📍 Working Directory: $(pwd)"
echo "🚀 Target Port: $PORT"
echo ""

# Check python3
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required to run the server."
    exit 1
fi

echo "✅ Python runtime verified: $(python3 --version)"
echo "🌐 Starting server at http://localhost:$PORT"
echo "=========================================================="

exec python3 server.py "$PORT"
