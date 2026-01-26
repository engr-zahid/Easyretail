# How to Run EasyRetail from Docker Hub

This guide shows how to run the EasyRetail Shop Management System using the pre-built Docker image from Docker Hub.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually included with Docker Desktop)

## Quick Start

### Step 1: Create docker-compose.yml

Create a file named `docker-compose.yml` with the following content:

```yaml
services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: easyretail-db
    environment:
      POSTGRES_USER: easyretail
      POSTGRES_PASSWORD: easyretail123
      POSTGRES_DB: easyretail_db
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U easyretail"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - easyretail-network

  # Shop Management Application
  app:
    image: ubaidurrahman1321/easyretail:latest
    container_name: easyretail-app
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://easyretail:easyretail123@postgres:5432/easyretail_db?schema=public
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./uploads:/app/backend/uploads
    networks:
      - easyretail-network
    restart: unless-stopped

networks:
  easyretail-network:
    driver: bridge

volumes:
  postgres_data:
```

### Step 2: Run the Application

```bash
# Pull the image and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker ps
```

### Step 3: Access the Application

- **Frontend:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health
- **API Products:** http://localhost:5000/api/products

## Common Commands

```bash
# Stop containers
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v

# Restart containers
docker-compose restart

# View application logs
docker logs easyretail-app -f

# View database logs
docker logs easyretail-db -f
```

## Troubleshooting

1. **Port 5000 already in use:**
   - Change the port mapping in docker-compose.yml: `"8080:5000"`
   - Then access at http://localhost:8080

2. **Port 5433 already in use:**
   - Change the PostgreSQL port mapping: `"5434:5432"`

3. **Image pull fails:**
   - Check internet connection
   - Verify image name: `ubaidurrahman1321/easyretail:latest`
   - Try: `docker pull ubaidurrahman1321/easyretail:latest`

4. **Database connection errors:**
   - Wait a few seconds for database to initialize
   - Check logs: `docker-compose logs postgres`

## Manual Docker Run (Alternative)

If you prefer not to use docker-compose:

```bash
# Start PostgreSQL
docker run -d \
  --name easyretail-db \
  -e POSTGRES_USER=easyretail \
  -e POSTGRES_PASSWORD=easyretail123 \
  -e POSTGRES_DB=easyretail_db \
  -p 5433:5432 \
  postgres:16-alpine

# Wait for database to be ready (about 10 seconds)
sleep 10

# Start application
docker run -d \
  --name easyretail-app \
  --link easyretail-db:postgres \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://easyretail:easyretail123@postgres:5432/easyretail_db?schema=public" \
  ubaidurrahman1321/easyretail:latest
```

## Image Information

- **Repository:** ubaidurrahman1321/easyretail
- **Tag:** latest
- **Docker Hub:** https://hub.docker.com/r/ubaidurrahman1321/easyretail

## Support

For issues or questions, check the logs:
```bash
docker-compose logs -f app
```
