#!/bin/bash

echo "📋 Showing AIBanker logs..."

docker-compose -f deployment/docker/docker-compose.yml logs -f
