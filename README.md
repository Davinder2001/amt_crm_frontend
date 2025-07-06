# AMT CRM Frontend

A Next.js-based frontend application for the AMT CRM system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Access to the AMT CRM backend API

### Environment Setup

#### Local Development
1. **Update the environment variables:**
   ```bash
   # Edit env file and update the backend API URL
   nano env
   # Update: NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-domain.com
   ```

2. **Deploy with Docker:**
   ```bash
   ./deploy.sh
   ```

#### Production Deployment (GitHub Secrets)

For production deployments, use GitHub Secrets instead of local environment files:

1. **Add GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL (e.g., `https://api.himmanav.com`)
     - `PROD_HOST`: Production server IP
     - `PROD_USER`: SSH username (usually `ubuntu`)
     - `PROD_SSH_KEY`: SSH private key for server access
     - `PROD_PORT`: SSH port (usually `22`)
     - `FRONTEND_DOMAIN`: Your frontend domain (e.g., `amt-crm.himmanav.com`)

2. **Deploy via CI/CD:**
   - Push to `production` branch
   - GitHub Actions will automatically deploy using secrets

## 🔒 Security

- **Environment files are gitignored** - `env` and `env.docker` files are never committed
- **Production uses GitHub Secrets** - No sensitive data in repository or Docker images
- Environment variables are automatically excluded from Docker builds
- CI/CD pipeline creates environment files from secrets at deployment time

## 🐳 Docker Deployment

The application uses Docker Compose for production deployment with:
- Nginx reverse proxy
- Let's Encrypt SSL certificates
- Automatic health checks

## 📁 Project Structure

```
amt_crm_frontend/
├── src/                    # Source code
├── docker/                 # Docker configurations
├── infra/                  # Infrastructure files
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.prod.yml # Production Docker setup
├── env                     # Environment file (gitignored)
├── env.docker              # Docker environment file (gitignored)
└── deploy.sh               # Local deployment script
```

## 🔗 Backend Integration

This frontend connects to the AMT CRM Laravel backend. Ensure your backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_BASE_URL`.

## 🚀 CI/CD Pipeline

The GitHub Actions workflow:
1. **Tests** the application
2. **Builds** Docker image
3. **Creates** environment files from GitHub Secrets
4. **Deploys** to production server
5. **Performs** health checks
6. **Notifies** on completion

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
