#!/bin/bash

# AMT CRM Frontend Deployment Script for Hostinger VM
# Usage: ./deploy.sh [hostinger-ip] [username]

set -e

# Configuration
HOSTINGER_IP=${1:-"31.97.186.147"}
USERNAME=${2:-"root"}
REMOTE_DIR="/srv/amt-crm-frontend"
LOCAL_ARCHIVE="amt-crm-frontend.tar.gz"

echo "🚀 Starting deployment to Hostinger VM..."
echo "📍 Target: $USERNAME@$HOSTINGER_IP:$REMOTE_DIR"

# Build the application
echo "📦 Building application..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf $LOCAL_ARCHIVE \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env*' \
  --exclude='*.log' \
  .

# Upload to server
echo "📤 Uploading to server..."
scp $LOCAL_ARCHIVE $USERNAME@$HOSTINGER_IP:/tmp/

# Deploy on server
echo "🔧 Deploying on server..."
ssh $USERNAME@$HOSTINGER_IP << EOF
  # Create directory if it doesn't exist
  sudo mkdir -p $REMOTE_DIR
  sudo chown $USERNAME:$USERNAME $REMOTE_DIR
  
  # Stop existing containers
  cd $REMOTE_DIR
  if [ -f docker-compose.http.yml ]; then
    docker-compose -f docker-compose.http.yml down
  fi
  
  # Extract new deployment
  cd $REMOTE_DIR
  tar -xzf /tmp/$LOCAL_ARCHIVE --strip-components=0
  rm /tmp/$LOCAL_ARCHIVE
  
  # Create logs directory for nginx
  mkdir -p docker/nginx/logs
  
  # Create environment file if it doesn't exist
  if [ ! -f env.docker ]; then
    cat > env.docker << 'ENVEOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://api.himmanav.com
NEXT_PUBLIC_SOCKET_URL=ws://api.himmanav.com
NEXT_PUBLIC_APP_URL=http://himmanav.com
ENVEOF
  fi
  
  # Build and start containers
  docker-compose -f docker-compose.http.yml build --no-cache
  docker-compose -f docker-compose.http.yml up -d
  
  # Clean up old images
  docker image prune -f
  
  # Check deployment status
  sleep 10
  docker-compose -f docker-compose.http.yml ps
  
  # Test health endpoint
  curl -f http://localhost/health || echo "Health check failed"
  
  echo "✅ Deployment completed successfully!"
EOF

# Clean up local archive
rm $LOCAL_ARCHIVE

echo "🎉 Deployment completed!"
echo "🌐 Frontend: http://himmanav.com"
echo "🔧 Health Check: http://himmanav.com/health" 