#!/bin/bash

# GreenSphere Setup Script
echo "🌱 Setting up GreenSphere - Gamified Environmental Education Platform"
echo "=================================================================="

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

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup server
echo "🔧 Setting up server..."
cd server

# Install server dependencies
npm install

# Create uploads directory
mkdir -p uploads

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created server/.env file. Please configure your environment variables."
fi

cd ..

# Setup client
echo "🎨 Setting up client..."
cd client

# Install client dependencies
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created client/.env file. Please configure your environment variables."
fi

cd ..

echo ""
echo "🎉 GreenSphere setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in server/.env and client/.env"
echo "2. Set up MongoDB Atlas and AWS Cognito"
echo "3. Run 'npm run dev' to start development servers"
echo "4. Run 'node server/seedData.js' to populate demo data"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
echo ""
echo "🚀 Happy coding! Let's save the planet together! 🌍"