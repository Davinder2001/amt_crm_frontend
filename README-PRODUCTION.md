# AMT CRM Frontend - Production Deployment Guide

This guide covers the complete production deployment setup for AMT CRM Frontend with Docker, AWS ECS, and CI/CD pipeline.

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- Docker installed and running
- Node.js 18+ installed
- Git access to the repository

### 1. Initial Setup

```bash
# Clone the repository and switch to production branch
git clone <repository-url>
cd amt_crm_frontend
git checkout production

# Install dependencies
npm install
```

### 2. AWS Infrastructure Setup

```bash
# Deploy AWS infrastructure
./aws/deploy.sh production us-east-1 your-domain.com
```

This will create:
- VPC with public and private subnets
- ECS Cluster with Fargate
- Application Load Balancer
- ECR Repository
- IAM Roles and Security Groups
- Auto Scaling configuration

### 3. Environment Variables

Set up the following environment variables in AWS Systems Manager Parameter Store:

```bash
# API URL
aws ssm put-parameter \
  --name "/amt-crm/api-url" \
  --value "https://your-api-domain.com" \
  --type "String" \
  --region us-east-1

# WebSocket URL
aws ssm put-parameter \
  --name "/amt-crm/ws-url" \
  --value "wss://your-ws-domain.com" \
  --type "String" \
  --region us-east-1
```

## 🔄 CI/CD Pipeline

### GitHub Secrets Required

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key with ECS/ECR permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `DOMAIN_NAME`: Your application domain
- `SNYK_TOKEN`: Snyk security scan token (optional)
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications (optional)

### Pipeline Stages

1. **Test & Build**: Linting, type checking, and build
2. **Security Scan**: npm audit and Snyk vulnerability scan
3. **Docker Build**: Build and push Docker image to ECR
4. **Deploy**: Deploy to AWS ECS with zero downtime
5. **Health Check**: Verify deployment success
6. **Notify**: Send deployment status to Slack

## 🐳 Docker Configuration

### Local Development

```bash
# Build and run locally
docker-compose up --build

# Production build
docker-compose -f docker-compose.prod.yml up --build
```

### Docker Images

- **Base**: Node.js 18 Alpine
- **Builder**: Multi-stage build for optimized production image
- **Runtime**: Minimal production image with security best practices

## 🌐 Nginx Configuration

### Features

- SSL/TLS termination
- HTTP/2 support
- Gzip compression
- Rate limiting
- Security headers
- Load balancing
- Health checks

### SSL Certificate

For production, replace the self-signed certificates:

```bash
# Copy your SSL certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem
```

## 📊 Monitoring & Logging

### CloudWatch Logs

Logs are automatically sent to CloudWatch with the following structure:
- Log Group: `/ecs/production-amt-crm-frontend`
- Stream Prefix: `ecs`

### Health Checks

- **Application**: `/api/health`
- **Load Balancer**: `/api/health`
- **ECS**: Container health check on port 3000

### Metrics

Monitor the following metrics:
- CPU utilization (target: 70%)
- Memory utilization
- Request count and latency
- Error rates

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs
docker build -t amt-crm-frontend . --progress=plain

# Verify Node.js version
node --version
```

#### 2. Deployment Failures

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster production-amt-crm-cluster \
  --services production-amt-crm-frontend-service

# Check task logs
aws logs describe-log-streams \
  --log-group-name /ecs/production-amt-crm-frontend \
  --order-by LastEventTime \
  --descending
```

#### 3. Health Check Failures

```bash
# Test health endpoint
curl -f https://your-domain.com/api/health

# Check container logs
docker logs <container-id>
```

### Emergency Rollback

```bash
# Manual rollback to previous version
aws ecs update-service \
  --cluster production-amt-crm-cluster \
  --service production-amt-crm-frontend-service \
  --task-definition production-amt-crm-frontend-task:1
```

Or use the GitHub Actions rollback workflow:
1. Go to Actions tab
2. Select "Emergency Rollback"
3. Enter the commit SHA to rollback to
4. Run the workflow

## 🔒 Security

### Security Features

- Non-root user in containers
- Security headers
- Rate limiting
- SSL/TLS encryption
- VPC isolation
- IAM least privilege

### Security Scanning

- Automated vulnerability scanning with Snyk
- npm audit in CI/CD pipeline
- Container image scanning in ECR

## 📈 Scaling

### Auto Scaling

The application automatically scales based on CPU utilization:
- **Min instances**: 2
- **Max instances**: 10
- **Target CPU**: 70%
- **Scale out cooldown**: 5 minutes
- **Scale in cooldown**: 5 minutes

### Manual Scaling

```bash
# Scale to specific number of tasks
aws ecs update-service \
  --cluster production-amt-crm-cluster \
  --service production-amt-crm-frontend-service \
  --desired-count 5
```

## 🗂️ File Structure

```
amt_crm_frontend/
├── .github/workflows/          # CI/CD workflows
│   ├── ci-cd.yml              # Main deployment pipeline
│   └── rollback.yml           # Emergency rollback
├── aws/                       # AWS infrastructure
│   ├── cloudformation.yml     # Infrastructure template
│   ├── ecs-task-definition.json # ECS task definition
│   └── deploy.sh              # Deployment script
├── nginx/                     # Nginx configuration
│   ├── nginx.conf             # Main nginx config
│   ├── conf.d/                # Server configurations
│   ├── ssl/                   # SSL certificates
│   └── logs/                  # Log files
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Local development
├── docker-compose.prod.yml    # Production compose
└── .dockerignore              # Docker build exclusions
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review CloudWatch logs
3. Check GitHub Actions workflow runs
4. Contact the development team

## 🔄 Updates

To update the application:

1. Make changes in a feature branch
2. Create a pull request to production
3. CI/CD pipeline will automatically:
   - Run tests
   - Build new Docker image
   - Deploy with zero downtime
   - Perform health checks

The deployment uses blue-green strategy to ensure zero downtime. 