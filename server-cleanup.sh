#!/bin/bash

# Server Cleanup Script for Hostinger VM
# Run this script on your Hostinger VM to free up port 80

set -e

echo "🧹 Cleaning up server to free port 80..."

# Stop system services
echo "🛑 Stopping system web services..."
sudo systemctl stop apache2 2>/dev/null || echo "Apache2 not running"
sudo systemctl stop nginx 2>/dev/null || echo "Nginx not running"
sudo systemctl stop lighttpd 2>/dev/null || echo "Lighttpd not running"

# Kill any remaining processes
echo "🔪 Killing any remaining web server processes..."
sudo pkill -f nginx 2>/dev/null || echo "No nginx processes found"
sudo pkill -f apache2 2>/dev/null || echo "No apache2 processes found"
sudo pkill -f lighttpd 2>/dev/null || echo "No lighttpd processes found"

# Wait for processes to stop
sleep 3

# Check what's using port 80
echo "🔍 Checking what's using port 80..."
if sudo netstat -tulpn | grep :80; then
    echo "⚠️  Port 80 is still in use. Force killing processes..."
    sudo fuser -k 80/tcp 2>/dev/null || echo "No processes to kill on port 80"
    sleep 2
else
    echo "✅ Port 80 is now free"
fi

# Disable services from auto-starting
echo "🚫 Disabling web services from auto-start..."
sudo systemctl disable apache2 2>/dev/null || echo "Apache2 not installed or already disabled"
sudo systemctl disable nginx 2>/dev/null || echo "Nginx not installed or already disabled"
sudo systemctl disable lighttpd 2>/dev/null || echo "Lighttpd not installed or already disabled"

# Final check
echo "🔍 Final port 80 check..."
if sudo netstat -tulpn | grep :80; then
    echo "❌ Port 80 is still in use:"
    sudo netstat -tulpn | grep :80
else
    echo "✅ Port 80 is free and ready for deployment"
fi

echo ""
echo "🎉 Server cleanup completed!"
echo "📋 Next steps:"
echo "1. Run your deployment script or push to production branch"
echo "2. Monitor deployment: cd /srv/amt-crm-frontend && docker-compose -f docker-compose.http.yml ps"
echo "3. Check logs: docker-compose -f docker-compose.http.yml logs -f" 