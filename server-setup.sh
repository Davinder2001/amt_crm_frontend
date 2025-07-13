#!/bin/bash

# Hostinger VM Setup Script for AMT CRM Frontend
# Run this script on your Hostinger VM to prepare it for deployment

set -e

echo "🚀 Setting up Hostinger VM for AMT CRM Frontend deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y curl wget git ufw

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "✅ Firewall configured"

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p /srv/amt-crm-frontend
sudo chown $USER:$USER /srv/amt-crm-frontend
echo "✅ Deployment directory created: /srv/amt-crm-frontend"

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p /srv/amt-crm-frontend/docker/nginx/logs
echo "✅ Logs directory created"

# Set up log rotation
echo "📋 Setting up log rotation..."
sudo tee /etc/logrotate.d/amt-crm-frontend > /dev/null << EOF
/srv/amt-crm-frontend/docker/nginx/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker exec amt_crm_nginx nginx -s reload
    endscript
}
EOF
echo "✅ Log rotation configured"

# Create systemd service for auto-start (optional)
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/amt-crm-frontend.service > /dev/null << EOF
[Unit]
Description=AMT CRM Frontend
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/srv/amt-crm-frontend
ExecStart=/usr/local/bin/docker-compose -f docker-compose.http.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.http.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl enable amt-crm-frontend.service
echo "✅ Systemd service created and enabled"

# Create monitoring script
echo "📊 Creating monitoring script..."
tee /srv/amt-crm-frontend/monitor.sh > /dev/null << 'EOF'
#!/bin/bash

echo "=== AMT CRM Frontend Status ==="
echo "Date: $(date)"
echo ""

echo "=== Container Status ==="
cd /srv/amt-crm-frontend
docker-compose -f docker-compose.http.yml ps

echo ""
echo "=== Health Checks ==="
echo "Nginx Health:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "Failed"

echo ""
echo "Frontend Health:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "Failed"

echo ""
echo "=== Resource Usage ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "=== Recent Logs ==="
docker-compose -f docker-compose.http.yml logs --tail=10
EOF

chmod +x /srv/amt-crm-frontend/monitor.sh
echo "✅ Monitoring script created"

# Create backup script
echo "💾 Creating backup script..."
tee /srv/amt-crm-frontend/backup.sh > /dev/null << 'EOF'
#!/bin/bash

BACKUP_DIR="/srv/backups/amt-crm-frontend"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="amt-crm-frontend_$DATE.tar.gz"

echo "Creating backup: $BACKUP_FILE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop containers
cd /srv/amt-crm-frontend
docker-compose -f docker-compose.http.yml down

# Create backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='*.log' \
  .

# Restart containers
docker-compose -f docker-compose.http.yml up -d

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs -r rm

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE"
EOF

chmod +x /srv/amt-crm-frontend/backup.sh
echo "✅ Backup script created"

# Set up cron jobs
echo "⏰ Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * /srv/amt-crm-frontend/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /srv/amt-crm-frontend/monitor.sh > /dev/null 2>&1") | crontab -
echo "✅ Cron jobs configured"

# Final instructions
echo ""
echo "🎉 Hostinger VM setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Add GitHub secrets to your repository:"
echo "   - HOSTINGER_HOST: $(curl -s ifconfig.me)"
echo "   - HOSTINGER_USERNAME: $USER"
echo "   - HOSTINGER_SSH_KEY: Your private SSH key"
echo ""
echo "2. Deploy your application:"
echo "   - Push to main/production branch for automatic deployment"
echo "   - Or run: ./deploy.sh $(curl -s ifconfig.me) $USER"
echo ""
echo "3. Useful commands:"
echo "   - Monitor: /srv/amt-crm-frontend/monitor.sh"
echo "   - Backup: /srv/amt-crm-frontend/backup.sh"
echo "   - Logs: cd /srv/amt-crm-frontend && docker-compose -f docker-compose.http.yml logs"
echo ""
echo "4. Auto-start service:"
echo "   - sudo systemctl start amt-crm-frontend"
echo "   - sudo systemctl status amt-crm-frontend"
echo ""
echo "🌐 Your application will be available at: http://himmanav.com" 