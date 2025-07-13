#!/bin/bash

# Server Cleanup Script for Hostinger VM
# Run this script on your Hostinger VM to free port 80 (carefully)

set -e

echo "🧹 Carefully cleaning up server to free port 80..."
echo "⚠️  Note: This script will preserve Docker-based services"

# Check current port usage
echo "🔍 Checking current port usage..."
echo "Port 80:"
sudo netstat -tulpn | grep :80 || echo "Port 80 is free"
echo "Port 443:"
sudo netstat -tulpn | grep :443 || echo "Port 443 is free"

# Check for existing Docker containers
echo "🐳 Checking existing Docker containers..."
docker ps -a

# Check for existing services
echo "🔧 Checking existing services..."
sudo systemctl status nginx 2>/dev/null || echo "Nginx not running as system service"
sudo systemctl status apache2 2>/dev/null || echo "Apache2 not running as system service"

# Only stop non-Docker services
echo "🛑 Stopping non-Docker web services..."
if sudo systemctl is-active --quiet nginx && ! docker ps | grep -q nginx; then
    echo "Stopping system nginx..."
    sudo systemctl stop nginx
    sudo systemctl disable nginx
else
    echo "Nginx is either not running or is Docker-based - leaving alone"
fi

if sudo systemctl is-active --quiet apache2 && ! docker ps | grep -q apache; then
    echo "Stopping system apache2..."
    sudo systemctl stop apache2
    sudo systemctl disable apache2
else
    echo "Apache2 is either not running or is Docker-based - leaving alone"
fi

# Wait for processes to stop
sleep 3

# Check if port 80 is still in use by non-Docker processes
echo "🔍 Checking if port 80 is still in use by non-Docker processes..."
if sudo netstat -tulpn | grep :80 | grep -v docker; then
    echo "⚠️  Port 80 is still in use by non-Docker processes:"
    sudo netstat -tulpn | grep :80
    echo "Force stopping non-Docker processes on port 80..."
    sudo fuser -k 80/tcp 2>/dev/null || echo "No non-Docker processes to kill on port 80"
    sleep 2
else
    echo "✅ Port 80 is free or only used by Docker containers"
fi

# Final check
echo "🔍 Final port 80 check..."
if sudo netstat -tulpn | grep :80; then
    echo "📋 Current port 80 usage:"
    sudo netstat -tulpn | grep :80
    echo ""
    echo "ℹ️  If Docker containers are using port 80, this is expected."
    echo "   The frontend deployment will handle port conflicts with Docker containers."
else
    echo "✅ Port 80 is completely free"
fi

echo ""
echo "🎉 Server cleanup completed!"
echo "📋 Next steps:"
echo "1. Run your deployment script or push to production branch"
echo "2. Monitor deployment: cd /srv/amt-crm-frontend && docker-compose -f docker-compose.http.yml ps"
echo "3. Check logs: docker-compose -f docker-compose.http.yml logs -f"
echo "4. Check all containers: docker ps" 