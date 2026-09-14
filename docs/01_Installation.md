# Installation & Setup Guide

## System Requirements
- Ubuntu 22.04 LTS
- Python 3.11+
- PostgreSQL 15
- Redis 7
- Docker & Docker Compose

## Step-by-Step Setup
1. **Clone & Environment:**
   ```bash
   git clone https://github.com/konjoduka/tradeos.git
   cd tradeos
   cp .env.example .env
   ```

2. **Backend Setup:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   flask db upgrade
   flask load-data  # Seed prices & policies
   flask compile-translations
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Docker Deployment:**
   ```bash
   docker-compose up -d --build
   ```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `OPENAI_API_KEY`: For policy extraction
- `STRIPE_SECRET_KEY`: Payment gateway
- `DARAJA_CONSUMER_KEY`: M-Pesa integration
- `CHAPA_SECRET_KEY`: Telebirr integration