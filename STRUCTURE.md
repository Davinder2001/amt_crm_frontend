# AMT CRM Frontend - Final Structure

## 📁 Complete Directory Structure

```
amt_crm_frontend/
├── .github/workflows/          # CI/CD workflows
│   ├── ci-cd.yml              # Main deployment pipeline (SCP/SSH)
│   └── rollback.yml           # Emergency rollback workflow
├── aws/                       # AWS infrastructure (alternative)
│   ├── cloudformation.yml     # CloudFormation template
│   ├── ecs-task-definition.json # ECS task definition
│   └── deploy.sh              # AWS deployment script
├── docker/                    # Container-specific configuration
│   └── nginx/                 # Container Nginx config
│       └── nginx.conf         # Internal container nginx
├── infra/                     # Infrastructure configuration
│   ├── nginx/                 # Server Nginx config
│   │   └── default.conf       # Production server nginx
│   ├── certs/                 # SSL certificates directory
│   ├── vhost.d/               # Virtual host configurations
│   ├── html/                  # Static HTML files
│   ├── frontend.yml           # Ansible playbook for provisioning
│   └── inventory.ini          # Ansible inventory file
├── src/                       # Next.js source code
├── public/                    # Static assets
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose with nginx-proxy
├── docker-compose.prod.yml    # Production Docker Compose
├── next.config.ts             # Next.js configuration
├── package.json               # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── .dockerignore              # Docker build exclusions
├── .gitignore                 # Git exclusions
├── README.md                  # Project documentation
├── README-PRODUCTION.md       # Production deployment guide
└── STRUCTURE.md               # This file
```

## 🔄 Nginx Configuration Architecture

### **Dual Nginx Setup (Matching Backend Pattern):**

1. **`docker/nginx/nginx.conf`** - Container-specific configuration
   - Runs inside the Docker container
   - Handles internal routing and security
   - Optimized for containerized environment

2. **`infra/nginx/default.conf`** - Infrastructure configuration
   - Runs on the production server
   - Handles SSL termination and reverse proxy
   - Manages domain routing and load balancing

## 🚀 Deployment Options

### **Option 1: Server Deployment (Recommended)**
```bash
# 1. Provision server
ansible-playbook -i infra/inventory.ini infra/frontend.yml

# 2. Deploy via CI/CD
git push origin production

# 3. Manual deployment
docker-compose up --build -d
```

### **Option 2: AWS ECS (Alternative)**
```bash
# Enable in CI/CD workflow
./aws/deploy.sh production us-east-1 your-domain.com
```

## 📊 Comparison with Backend

| Component | Backend | Frontend | Status |
|-----------|---------|----------|---------|
| **Nginx Location** | `infra/nginx/` | ✅ `infra/nginx/` | ✅ Matched |
| **Docker Nginx** | `docker/nginx/` | ✅ `docker/nginx/` | ✅ Matched |
| **Ansible** | `infra/backend.yml` | ✅ `infra/frontend.yml` | ✅ Matched |
| **CI/CD** | SCP/SSH | ✅ SCP/SSH | ✅ Matched |
| **Docker Compose** | nginx-proxy | ✅ nginx-proxy | ✅ Matched |
| **Let's Encrypt** | Auto SSL | ✅ Auto SSL | ✅ Matched |
| **Health Checks** | `/health` | ✅ `/api/health` | ✅ Matched |
| **Structure** | Clean | ✅ Clean | ✅ Matched |

## 🔧 Key Features

### **Security:**
- ✅ Non-root user in containers
- ✅ Security headers
- ✅ Rate limiting
- ✅ SSL/TLS encryption
- ✅ VPC isolation (AWS)

### **Performance:**
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Load balancing
- ✅ Auto scaling (AWS)

### **Monitoring:**
- ✅ Health checks
- ✅ CloudWatch logs (AWS)
- ✅ Application metrics

### **Automation:**
- ✅ CI/CD pipeline
- ✅ Ansible provisioning
- ✅ Let's Encrypt SSL
- ✅ Zero-downtime deployment

## 🎯 Benefits

1. **Consistency** - Frontend matches backend architecture perfectly
2. **Maintainability** - Same patterns across both services
3. **Scalability** - Auto-scaling and load balancing
4. **Security** - Production-grade security measures
5. **Automation** - Fully automated deployment pipeline
6. **Monitoring** - Comprehensive health checks and logging

## 📝 Next Steps

1. **Update domain names** in configuration files
2. **Set up GitHub secrets** for CI/CD
3. **Configure SSL certificates** for production
4. **Test deployment** on staging environment
5. **Monitor performance** and logs

The frontend now has the same professional, production-ready structure as your backend! 🎉 