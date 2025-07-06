#!/bin/bash

# Production Deployment Script for AMT CRM Frontend
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting AMT CRM Frontend deployment..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Check if env file exists, if not create it
if [ ! -f "env" ]; then
    echo "📝 Creating env file..."
    cat > env << EOF
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.himmanav.com
EOF
    echo "⚠️  Please update env file with your backend API URLs if needed."
    echo "   Key variable to update: NEXT_PUBLIC_API_BASE_URL"
    echo "   For production: Use GitHub Secrets instead of local env files"
    read -p "Press Enter after updating env file..."
fi

# Check if env.docker file exists, if not create it
if [ ! -f "env.docker" ]; then
    echo "📝 Creating env.docker file..."
    cp env env.docker
    echo "✅ env.docker file created from env file"
fi

# Load environment variables
if [ -f "env" ]; then
    export $(cat env | grep -v '^#' | xargs)
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p infra/certs
mkdir -p infra/vhost.d
mkdir -p infra/html

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 infra

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down --remove-orphans || true

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up --build -d

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
sleep 30

# Check if frontend container is running
if ! docker compose ps frontend | grep -q "Up"; then
    echo "❌ Frontend container is not running. Checking logs..."
    docker compose logs frontend
    exit 1
fi

# Health check
echo "🏥 Performing health check..."
for i in {1..10}; do
    if curl -f http://localhost/api/health; then
        echo "✅ Frontend is healthy"
        break
    fi
    echo "Attempt $i: Frontend not ready yet, waiting..."
    sleep 30
done

# Check backend connectivity
echo "🔗 Checking backend connectivity..."
if [ -n "$NEXT_PUBLIC_API_BASE_URL" ]; then
    if curl -f "$NEXT_PUBLIC_API_BASE_URL/health"; then
        echo "✅ Backend is accessible"
    else
        echo "⚠️  Warning: Backend is not accessible. Please check backend deployment."
    fi
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your frontend should be available at: https://himmanav.com"
echo "🔗 Backend API: ${NEXT_PUBLIC_API_BASE_URL:-https://api.himmanav.com}"
echo "📊 Check container status with: docker compose ps"
echo "📝 View logs with: docker compose logs -f"

# Optional: Show container status
echo ""
echo "📋 Container Status:"
docker compose ps

echo ""
echo "🔒 Security Note:"
echo "   For production deployments, use GitHub Secrets instead of local env files."
echo "   The CI/CD pipeline will automatically create env files from secrets." 