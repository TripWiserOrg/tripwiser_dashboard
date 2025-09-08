#!/bin/bash

echo "🚀 Setting up TripWiser Admin Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# TripWiser Admin Dashboard Environment Variables

# API Configuration
REACT_APP_API_URL=https://tripwiser-backend.onrender.com

# Optional: Development API URL
# REACT_APP_API_URL=https://e2fb1ffcfa14.ngrok-free.app

# Optional: Enable debug mode
# REACT_APP_DEBUG=true
EOL
    echo "✅ .env file created!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "The dashboard will be available at http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
