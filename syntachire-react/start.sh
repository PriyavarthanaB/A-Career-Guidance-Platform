#!/bin/bash
# Quick Start Script for SyntacHire React Frontend

echo "🚀 Starting SyntacHire React Frontend..."
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start development server
echo "🎉 Starting development server..."
echo "📍 Open http://localhost:5173 in your browser"
echo ""
echo "Test Accounts:"
echo "  Email: alex@example.com"
echo "  Password: demo123"
echo ""
echo "  Email: demo@demo.com"
echo "  Password: demo123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
