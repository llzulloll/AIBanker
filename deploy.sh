#!/bin/bash

echo "🚀 Deploying AIBanker to production..."

# Build and start services
docker-compose -f deployment/docker/docker-compose.yml up -d --build

echo "✅ Deployment complete!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api/v1"
echo "API Documentation: http://localhost/api/v1/docs"
