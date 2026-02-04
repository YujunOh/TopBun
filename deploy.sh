#!/bin/bash
# TopBun Vercel Deployment Script
# Usage: ./deploy.sh

echo "🚀 TopBun Deployment Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI found"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Please create .env file with production values"
    echo "See .env.example for reference"
    exit 1
fi

echo "✅ .env file exists"
echo ""

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
echo ""
echo "NOTE: First time? You'll need to:"
echo "  1. Login to Vercel (browser will open)"
echo "  2. Link this project to Vercel"
echo "  3. Set environment variables in Vercel dashboard"
echo ""
read -p "Press Enter to continue..."

vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📱 PWA Features:"
echo "  - Users can install app to home screen"
echo "  - Works offline (cached)"
echo "  - Fast loading"
echo ""
echo "Next steps:"
echo "  1. Visit your Vercel dashboard to see deployment"
echo "  2. Test PWA: Open site on mobile → Menu → 'Install app'"
echo "  3. Set remaining environment variables if needed"
echo ""
echo "🎉 Done!"
