# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- MongoDB Atlas account (for production)
- Razorpay account with API keys
- Cloud provider account (GCP, AWS, Azure, or Heroku)
- GitHub repository with actions enabled

## Environment Setup

### 1. Create Environment Files

#### Backend (.env)
```bash
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prasthanam?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=rzp_live_secret_xxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx
ADMIN_EMAIL=admin@prasthanam.com
ADMIN_PASSWORD=secure_password_here
CORS_ORIGIN=https://yourdomain.com,https://api.yourdomain.com
LOG_LEVEL=info
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend (.env)
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

## Deployment Options

### Option 1: Docker Compose (Development/Staging)

```bash
# Build and run locally
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Option 2: Heroku

#### Deploy Backend to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create prasthanam-backend

# Add MongoDB add-on
heroku addons:create mongolab:sandbox --app prasthanam-backend

# Set environment variables
heroku config:set NODE_ENV=production --app prasthanam-backend
heroku config:set JWT_SECRET=your-secret --app prasthanam-backend
heroku config:set RAZORPAY_KEY_ID=your-key --app prasthanam-backend
heroku config:set RAZORPAY_KEY_SECRET=your-secret --app prasthanam-backend

# Deploy
cd backend
git push heroku main

# View logs
heroku logs --tail --app prasthanam-backend
```

#### Deploy Frontend to Heroku

```bash
# Create app
heroku create prasthanam-frontend

# Add buildpack
heroku buildpacks:add mars/create-react-app --app prasthanam-frontend

# Set environment variables
heroku config:set VITE_API_URL=https://prasthanam-backend.herokuapp.com --app prasthanam-frontend

# Deploy
cd frontend
git push heroku main

# View logs
heroku logs --tail --app prasthanam-frontend
```

### Option 3: Google Cloud Run

#### Deploy Backend

```bash
cd backend

# Build image
docker build -t gcr.io/PROJECT_ID/prasthanam-backend .

# Push to Container Registry
docker push gcr.io/PROJECT_ID/prasthanam-backend

# Deploy to Cloud Run
gcloud run deploy prasthanam-backend \
  --image gcr.io/PROJECT_ID/prasthanam-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars MONGODB_URI=your-mongodb-uri,JWT_SECRET=your-secret,RAZORPAY_KEY_ID=your-key,RAZORPAY_KEY_SECRET=your-secret
```

#### Deploy Frontend

```bash
cd frontend

# Build
npm run build

# Create app.yaml for App Engine
cat > app.yaml << EOF
runtime: nodejs18
env: standard

handlers:
- url: /.*
  static_files: dist/index.html
  upload: dist/index.html
EOF

# Deploy
gcloud app deploy
```

### Option 4: AWS ECS

#### Create ECR Repositories

```bash
aws ecr create-repository --repository-name prasthanam-backend --region us-east-1
aws ecr create-repository --repository-name prasthanam-frontend --region us-east-1
```

#### Push Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Backend
docker build -t YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/prasthanam-backend:latest ./backend
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/prasthanam-backend:latest

# Frontend
docker build -t YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/prasthanam-frontend:latest ./frontend
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/prasthanam-frontend:latest
```

#### Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name prasthanam

# Register task definitions
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json

# Create services
aws ecs create-service --cluster prasthanam --service-name prasthanam-backend --task-definition prasthanam-backend --desired-count 2 --launch-type FARGATE
aws ecs create-service --cluster prasthanam --service-name prasthanam-frontend --task-definition prasthanam-frontend --desired-count 2 --launch-type FARGATE
```

## CI/CD Pipeline Setup

### GitHub Actions Workflows

Workflows are already configured in `.github/workflows/`:

1. **backend.yml** - Tests, builds, and deploys backend
2. **frontend.yml** - Tests, builds, and deploys frontend

### Setting Up Secrets

Add the following secrets to your GitHub repository:

```
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
HEROKU_API_KEY=your-heroku-api-key
GCP_PROJECT_ID=your-gcp-project-id
GCP_SA_KEY=your-gcp-service-account-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

## Database Setup

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Create database user with username and password
3. Whitelist IP addresses
4. Get connection string
5. Set `MONGODB_URI` in environment variables

### Migrations

Run migrations with:
```bash
cd backend
npm run migrate
```

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
# Install Sentry
npm install @sentry/node

# Set environment variable
export SENTRY_DSN=your-sentry-dsn
```

### Prometheus & Grafana (Metrics)

```bash
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
```

## SSL/TLS Certificate

### Using Let's Encrypt with Certbot

```bash
certbot certonly --standalone -d yourdomain.com
```

### Using Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://backend:4000;
    }
}
```

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net/prasthanam" --out ./backup

# Restore
mongorestore --uri="mongodb+srv://user:password@cluster.mongodb.net/prasthanam" ./backup
```

### Regular Backups

Schedule daily backups:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### CDN Setup

1. Configure CloudFront for frontend distribution
2. Set cache headers for static assets
3. Use image optimization services

### Database Optimization

```bash
# Create indexes
db.events.createIndex({ slug: 1 })
db.events.createIndex({ "location.city": 1 })
db.bookings.createIndex({ userId: 1 })
db.payments.createIndex({ razorpayOrderId: 1 })
```

## Troubleshooting

### Common Issues

**Backend won't connect to MongoDB**
- Verify connection string
- Check IP whitelist on MongoDB Atlas
- Ensure credentials are correct

**Frontend API calls fail**
- Check CORS settings
- Verify API_URL environment variable
- Check browser console for errors

**Payment webhook not working**
- Verify webhook secret
- Check Razorpay dashboard for webhook events
- Ensure endpoint is publicly accessible

### Debug Mode

```bash
# Backend debug
DEBUG=* npm start

# Frontend debug
npm run dev
```

## Rollback Procedure

```bash
# Heroku
heroku releases --app prasthanam-backend
heroku rollback v{number} --app prasthanam-backend

# Docker
docker-compose pull
docker-compose up --build
```

## Security Checklist

- [ ] All environment variables are set securely
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] Database backups are automated
- [ ] Logs are monitored
- [ ] SSL certificates are valid and renewed
- [ ] Security headers are set
- [ ] Secrets are rotated regularly

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review service logs: `docker-compose logs`
3. Check error tracking (Sentry)
4. Review application logs
