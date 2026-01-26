# Quick Start Guide for Running EasyRetail

This is a quick guide for running the EasyRetail Shop Management System using Docker.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (usually included with Docker Desktop)

## Option 1: Using Pre-built Image (Recommended)

If you received a Docker image name (e.g., `username/easyretail-app:latest`):

1. **Get the docker-compose file:**
   - Use `docker-compose.pull.yml` from this repository
   - Or create it using the template in `SHARING.md`

2. **Update the image name:**
   ```yaml
   # In docker-compose.pull.yml, change:
   image: YOUR_DOCKERHUB_USERNAME/easyretail-app:latest
   # To your actual image name
   ```

3. **Run:**
   ```bash
   docker-compose -f docker-compose.pull.yml up -d
   ```

4. **Access the application:**
   - Open browser: http://localhost:5000
   - API Health: http://localhost:5000/health

## Option 2: Build from Source

If you have the source code:

1. **Clone or extract the project**

2. **Build and run:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Open browser: http://localhost:5000

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart
docker-compose restart

# Check status
docker ps
```

## Troubleshooting

- **Port 5000 already in use:** Change the port in docker-compose.yml: `"8080:5000"`
- **Database errors:** Wait a few seconds for database to initialize, check logs
- **Image not found:** Verify the image name is correct and accessible

For more details, see `SHARING.md` or `DOCKER.md`.
