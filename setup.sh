#!/bin/bash

# AIBanker MVP Setup Script
echo "🚀 Setting up AIBanker MVP..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are available."

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file with default values..."
    cat > .env << EOF
# AIBanker Environment Variables

# Database
DATABASE_URL=postgresql+asyncpg://aibanker_user:aibanker_password@localhost:5432/aibanker

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=aibanker-documents

# AI/ML Configuration
HUGGINGFACE_API_KEY=your-huggingface-api-key
OPENAI_API_KEY=your-openai-api-key

# External APIs
REFINITIV_API_KEY=your-refinitiv-api-key
REFINITIV_BASE_URL=https://api.refinitiv.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@aibanker.com

# Redis
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/aibanker.log

# Compliance
GDPR_ENABLED=true
DATA_RETENTION_DAYS=2555
EOF
    print_warning "Please update the .env file with your actual API keys and configuration."
fi

# Create logs directory
mkdir -p logs

# Create SSL directory for nginx
mkdir -p deployment/docker/ssl

# Create nginx configuration
print_status "Creating nginx configuration..."
cat > deployment/docker/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            proxy_pass http://backend/health;
        }
    }
}
EOF

# Create development setup script
print_status "Creating development setup script..."
cat > dev-setup.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up AIBanker for development..."

# Backend setup
echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo "✅ Development setup complete!"
echo "To start the backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "To start the frontend: cd frontend && npm start"
EOF

chmod +x dev-setup.sh

# Create production deployment script
print_status "Creating production deployment script..."
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying AIBanker to production..."

# Build and start services
docker-compose -f deployment/docker/docker-compose.yml up -d --build

echo "✅ Deployment complete!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api/v1"
echo "API Documentation: http://localhost/api/v1/docs"
EOF

chmod +x deploy.sh

# Create stop script
print_status "Creating stop script..."
cat > stop.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping AIBanker services..."

docker-compose -f deployment/docker/docker-compose.yml down

echo "✅ Services stopped!"
EOF

chmod +x stop.sh

# Create logs script
print_status "Creating logs script..."
cat > logs.sh << 'EOF'
#!/bin/bash

echo "📋 Showing AIBanker logs..."

docker-compose -f deployment/docker/docker-compose.yml logs -f
EOF

chmod +x logs.sh

print_status "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your API keys and configuration"
echo "2. For development: ./dev-setup.sh"
echo "3. For production: ./deploy.sh"
echo "4. To stop services: ./stop.sh"
echo "5. To view logs: ./logs.sh"
echo ""
echo "Documentation:"
echo "- Backend API: http://localhost:8000/docs"
echo "- Frontend: http://localhost:3000"
echo "- Project README: README.md" 