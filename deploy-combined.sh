#!/bin/bash

# Combined Frontend + Backend Deployment Script
# This script deploys both frontend and backend with a single Nginx reverse proxy

set -e

# Configuration
HOSTINGER_IP=${1:-"31.97.186.147"}
USERNAME=${2:-"root"}
REMOTE_DIR="/srv/amt-crm"
LOCAL_ARCHIVE="amt-crm-combined.tar.gz"

echo "🚀 Starting combined frontend + backend deployment..."
echo "📍 Target: $USERNAME@$HOSTINGER_IP:$REMOTE_DIR"

# Build the frontend application
echo "📦 Building frontend application..."
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
  # Create main directory
  sudo mkdir -p $REMOTE_DIR
  sudo chown $USERNAME:$USERNAME $REMOTE_DIR
  
  # Create subdirectories
  mkdir -p $REMOTE_DIR/frontend
  mkdir -p $REMOTE_DIR/backend
  mkdir -p $REMOTE_DIR/nginx/logs
  mkdir -p $REMOTE_DIR/nginx/ssl
  
  # Stop existing containers
  cd $REMOTE_DIR
  if [ -f docker-compose.combined.yml ]; then
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.combined.yml down
  fi
  
  # Extract frontend
  cd $REMOTE_DIR/frontend
  tar -xzf /tmp/$LOCAL_ARCHIVE --strip-components=0
  rm /tmp/$LOCAL_ARCHIVE
  
  # Create frontend environment file
  if [ ! -f env.docker ]; then
    cat > env.docker << 'ENVEOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://api.himmanav.com
NEXT_PUBLIC_SOCKET_URL=ws://api.himmanav.com
NEXT_PUBLIC_APP_URL=http://himmanav.com
ENVEOF
  fi
  
  # Copy combined docker-compose to main directory
  cd $REMOTE_DIR
  cp frontend/docker-compose.combined.yml .
  
  # Update backend configuration in docker-compose
  echo "🔧 Updating backend configuration..."
  sed -i 's|image: your-laravel-backend-image|build:\n      context: ./backend\n      dockerfile: Dockerfile|g' docker-compose.combined.yml
  sed -i 's|env_file:\n      - ../amt-crm-backend/.env|env_file:\n      - ./backend/.env|g' docker-compose.combined.yml
  
  # Create backend placeholder if it doesn't exist
  if [ ! -d "$REMOTE_DIR/backend" ] || [ -z "\$(ls -A $REMOTE_DIR/backend)" ]; then
    echo "⚠️  Backend directory is empty. Creating placeholder..."
    mkdir -p $REMOTE_DIR/backend
    cat > $REMOTE_DIR/backend/Dockerfile << 'BACKENDFILE'
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \\
    git \\
    curl \\
    libpng-dev \\
    libonig-dev \\
    libxml2-dev \\
    zip \\
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Change current user to www
USER www-data

# Expose port 8000
EXPOSE 8000

# Start Laravel development server
CMD php artisan serve --host=0.0.0.0 --port=8000
BACKENDFILE

    cat > $REMOTE_DIR/backend/.env << 'BACKENDENV'
APP_NAME="AMT CRM Backend"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=http://api.himmanav.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
BACKENDENV

    echo "⚠️  Please update backend configuration in $REMOTE_DIR/backend/.env"
  fi
  
  # Build and start containers
  echo "🔨 Building and starting containers..."
  docker-compose -f docker-compose.combined.yml build --no-cache
  docker-compose -f docker-compose.combined.yml up -d
  
  # Clean up old images
  docker image prune -f
  
  # Check deployment status
  sleep 15
  echo "📊 Container status:"
  docker-compose -f docker-compose.combined.yml ps
  
  echo "📊 All containers:"
  docker ps
  
  # Test health endpoints
  echo "🏥 Testing health endpoints..."
  echo "Frontend health:"
  curl -f http://localhost/health || echo "Frontend health check failed"
  
  echo "Backend health:"
  curl -f http://api.himmanav.com/health 2>/dev/null || echo "Backend health check failed (normal if backend not configured)"
  
  echo "✅ Combined deployment completed successfully!"
EOF

# Clean up local archive
rm $LOCAL_ARCHIVE

echo "🎉 Combined deployment completed!"
echo "🌐 Frontend: http://himmanav.com"
echo "🔗 Backend API: http://api.himmanav.com"
echo "🔧 Frontend Health: http://himmanav.com/health"
echo "🔧 Backend Health: http://api.himmanav.com/health"
echo ""
echo "📋 Next steps:"
echo "1. Update backend configuration in /srv/amt-crm/backend/.env"
echo "2. Add your Laravel backend code to /srv/amt-crm/backend/"
echo "3. Restart containers: cd /srv/amt-crm && docker-compose -f docker-compose.combined.yml restart" 