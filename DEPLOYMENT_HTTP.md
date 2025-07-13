# AMT CRM Frontend - HTTP Deployment Guide

This guide covers deploying the AMT CRM Frontend to a Hostinger VM using HTTP-only configuration.

## 🏗️ Architecture

- **Frontend**: Next.js application running on port 3000
- **Nginx**: Reverse proxy on port 80 (HTTP only)
- **Deployment**: `/srv/amt-crm-frontend` on Hostinger VM
- **Domain**: `himmanav.com`

## 📋 Prerequisites

### Hostinger VM Setup
1. **Docker & Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Firewall Configuration**
   ```bash
   # Allow HTTP and SSH
   sudo ufw allow 80/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **Create Deployment Directory**
   ```bash
   sudo mkdir -p /srv/amt-crm-frontend
   sudo chown $USER:$USER /srv/amt-crm-frontend
   ```

### GitHub Secrets Setup
Add these secrets to your GitHub repository:

- `HOSTINGER_HOST`: Your VM IP (e.g., `31.97.186.147`)
- `HOSTINGER_USERNAME`: SSH username (usually `root`)
- `HOSTINGER_SSH_KEY`: Your private SSH key

## 🚀 Deployment Methods

### Method 1: GitHub Actions (Recommended)

1. **Push to main/production branch**
   ```bash
   git push origin main
   ```

2. **Monitor deployment**
   - Go to GitHub Actions tab
   - Watch the "Deploy to Hostinger VM (HTTP)" workflow

### Method 2: Manual Deployment

1. **Run deployment script**
   ```bash
   ./deploy.sh [hostinger-ip] [username]
   ```

   Example:
   ```bash
   ./deploy.sh 31.97.186.147 root
   ```

### Method 3: Direct SSH Deployment

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Create deployment package**
   ```bash
   tar -czf amt-crm-frontend.tar.gz \
     --exclude='.git' \
     --exclude='node_modules' \
     --exclude='.next' \
     --exclude='.env*' \
     --exclude='*.log' \
     .
   ```

3. **Upload and deploy**
   ```bash
   scp amt-crm-frontend.tar.gz root@31.97.186.147:/tmp/
   ssh root@31.97.186.147
   
   # On the server:
   cd /srv/amt-crm-frontend
   tar -xzf /tmp/amt-crm-frontend.tar.gz --strip-components=0
   docker-compose -f docker-compose.http.yml up -d --build
   ```

## 🔧 Configuration Files

### Environment Variables (`env.docker`)
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://api.himmanav.com
NEXT_PUBLIC_SOCKET_URL=ws://api.himmanav.com
NEXT_PUBLIC_APP_URL=http://himmanav.com
```

### Docker Compose (`docker-compose.http.yml`)
- Frontend container on port 3000
- Nginx reverse proxy on port 80
- Health checks for both services
- Automatic restart policies

### Nginx Configuration (`docker/nginx/nginx.http.conf`)
- HTTP-only configuration
- Rate limiting for API and login endpoints
- Security headers
- Static file caching
- Gzip compression

## 📊 Monitoring & Maintenance

### Check Application Status
```bash
# On the server
cd /srv/amt-crm-frontend
docker-compose -f docker-compose.http.yml ps
```

### View Logs
```bash
# Frontend logs
docker-compose -f docker-compose.http.yml logs frontend

# Nginx logs
docker-compose -f docker-compose.http.yml logs nginx

# All logs
docker-compose -f docker-compose.http.yml logs -f
```

### Health Checks
```bash
# Application health
curl http://himmanav.com/health

# API health
curl http://himmanav.com/api/health
```

### Update Application
```bash
# Pull latest changes
cd /srv/amt-crm-frontend
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.http.yml down
docker-compose -f docker-compose.http.yml up -d --build
```

## 🔒 Security Features

### Rate Limiting
- API endpoints: 10 requests/second
- Login endpoint: 5 requests/minute

### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: default-src 'self'

### Access Control
- Hidden files denied
- Health endpoint accessible
- Static files cached

## 🐛 Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **Docker permission issues**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Container won't start**
   ```bash
   docker-compose -f docker-compose.http.yml logs
   docker system prune -f
   ```

4. **Health check fails**
   ```bash
   # Check if frontend is responding
   curl http://localhost:3000/api/health
   
   # Check nginx configuration
   docker exec amt_crm_nginx nginx -t
   ```

### Log Locations
- Nginx logs: `/srv/amt-crm-frontend/docker/nginx/logs/`
- Container logs: `docker-compose -f docker-compose.http.yml logs`

## 📈 Performance Optimization

### Caching
- Static files cached for 1 year
- Gzip compression enabled
- Browser caching headers

### Resource Limits
- Nginx worker connections: 1024
- Keep-alive timeout: 65 seconds
- Proxy timeouts: 60 seconds

## 🔄 Backup & Recovery

### Backup Application
```bash
cd /srv/amt-crm-frontend
tar -czf backup-$(date +%Y%m%d).tar.gz .
```

### Restore Application
```bash
cd /srv/amt-crm-frontend
tar -xzf backup-YYYYMMDD.tar.gz
docker-compose -f docker-compose.http.yml up -d
```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose -f docker-compose.http.yml logs`
2. Verify configuration: `docker exec amt_crm_nginx nginx -t`
3. Test connectivity: `curl http://localhost/health`

## 🔗 Useful Commands

```bash
# Quick status check
docker-compose -f docker-compose.http.yml ps

# Restart services
docker-compose -f docker-compose.http.yml restart

# View resource usage
docker stats

# Clean up unused resources
docker system prune -f

# Update images
docker-compose -f docker-compose.http.yml pull
``` 