# Frontend + Backend Coexistence Guide

This guide covers deploying both the AMT CRM Frontend (Next.js) and Backend (Laravel) on the same Hostinger VM.

## 🏗️ Architecture Overview

```
Hostinger VM (31.97.186.147)
├── Frontend (Next.js)
│   ├── Domain: himmanav.com
│   ├── Port: 80 (via Nginx proxy)
│   └── Location: /srv/amt-crm-frontend
└── Backend (Laravel)
    ├── Domain: api.himmanav.com
    ├── Port: 8000 (or custom)
    └── Location: /srv/amt-crm-backend
```

## 📋 Prerequisites

### DNS Configuration
Ensure your Route 53 DNS points both domains to the same IP:
- `himmanav.com` → `31.97.186.147`
- `api.himmanav.com` → `31.97.186.147`

### Server Requirements
- Docker & Docker Compose installed
- Ports 80, 443, and 8000 available
- Sufficient disk space for both applications

## 🚀 Deployment Strategy

### Option 1: Separate Docker Compose Files (Recommended)

**Frontend (`/srv/amt-crm-frontend/docker-compose.http.yml`):**
```yaml
services:
  frontend:
    build: .
    container_name: amt_crm_frontend
    ports:
      - "3000:3000"
    networks:
      - frontend

  nginx:
    image: nginx:alpine
    container_name: amt_crm_nginx
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx/nginx.http.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
```

**Backend (`/srv/amt-crm-backend/docker-compose.yml`):**
```yaml
services:
  backend:
    build: .
    container_name: amt_crm_backend
    ports:
      - "8000:8000"
    networks:
      - backend

  nginx:
    image: nginx:alpine
    container_name: amt_crm_backend_nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

### Option 2: Combined Docker Compose (Alternative)

Create a single `docker-compose.yml` in `/srv/`:

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./amt-crm-frontend
      dockerfile: Dockerfile
    container_name: amt_crm_frontend
    restart: unless-stopped
    env_file:
      - ./amt-crm-frontend/env.docker
    expose:
      - "3000"
    networks:
      - amt_network

  # Frontend Nginx
  frontend_nginx:
    image: nginx:alpine
    container_name: amt_crm_frontend_nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./amt-crm-frontend/docker/nginx/nginx.http.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
    networks:
      - amt_network

  # Backend
  backend:
    build:
      context: ./amt-crm-backend
      dockerfile: Dockerfile
    container_name: amt_crm_backend
    restart: unless-stopped
    env_file:
      - ./amt-crm-backend/.env
    expose:
      - "8000"
    networks:
      - amt_network

  # Backend Nginx
  backend_nginx:
    image: nginx:alpine
    container_name: amt_crm_backend_nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./amt-crm-backend/nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    networks:
      - amt_network

networks:
  amt_network:
    driver: bridge
```

## 🔧 Nginx Configuration

### Frontend Nginx (`docker/nginx/nginx.http.conf`)
```nginx
server {
    listen 80;
    server_name himmanav.com www.himmanav.com;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Backend Nginx (`nginx/nginx.conf`)
```nginx
server {
    listen 80;
    server_name api.himmanav.com;
    
    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring Commands

### Check All Services
```bash
# All containers
docker ps -a

# Frontend status
cd /srv/amt-crm-frontend
docker-compose -f docker-compose.http.yml ps

# Backend status
cd /srv/amt-crm-backend
docker-compose ps
```

### View Logs
```bash
# Frontend logs
cd /srv/amt-crm-frontend
docker-compose -f docker-compose.http.yml logs -f

# Backend logs
cd /srv/amt-crm-backend
docker-compose logs -f

# All logs
docker logs -f amt_crm_frontend
docker logs -f amt_crm_backend
```

### Health Checks
```bash
# Frontend health
curl http://himmanav.com/health

# Backend health
curl http://api.himmanav.com/health

# Direct container health
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

## 🔄 Deployment Workflow

### 1. Deploy Backend First
```bash
# SSH to server
ssh root@31.97.186.147

# Deploy backend
cd /srv/amt-crm-backend
git pull origin main
docker-compose down
docker-compose up -d --build
```

### 2. Deploy Frontend
```bash
# Push to production branch (automatic deployment)
git push origin production

# Or manual deployment
./deploy.sh 31.97.186.147 root
```

### 3. Verify Both Services
```bash
# Check both are running
docker ps

# Test connectivity
curl http://himmanav.com/health
curl http://api.himmanav.com/health
```

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Container Issues
```bash
# Restart specific service
docker-compose -f docker-compose.http.yml restart frontend

# Rebuild specific service
docker-compose -f docker-compose.http.yml up -d --build frontend

# Check container logs
docker logs amt_crm_frontend
docker logs amt_crm_backend
```

### Network Issues
```bash
# Check Docker networks
docker network ls

# Inspect network
docker network inspect amt_network

# Connect containers to network
docker network connect amt_network amt_crm_frontend
```

## 📈 Performance Optimization

### Resource Limits
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    restart: unless-stopped

  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
    restart: unless-stopped
```

### Caching
- Frontend: Static assets cached via Nginx
- Backend: Redis for session and cache storage
- Database: Query optimization and indexing

## 🔒 Security Considerations

### Firewall Rules
```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Backend API
```

### Environment Variables
- Keep sensitive data in `.env` files
- Use Docker secrets for production
- Never commit secrets to Git

### SSL/TLS
- Consider using Let's Encrypt for HTTPS
- Configure SSL termination at Nginx level
- Use secure headers and CSP policies

## 📞 Support Commands

```bash
# Quick status check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Resource usage
docker stats

# Clean up unused resources
docker system prune -f

# Backup both applications
tar -czf backup-$(date +%Y%m%d).tar.gz /srv/amt-crm-frontend /srv/amt-crm-backend
``` 