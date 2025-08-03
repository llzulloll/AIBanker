#!/bin/bash

echo "🛑 Stopping AIBanker services..."

docker-compose -f deployment/docker/docker-compose.yml down

echo "✅ Services stopped!"
