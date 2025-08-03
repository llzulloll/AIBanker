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
