# Docker Setup for Shop Management System

This project is dockerized with a single Dockerfile that builds both frontend and backend into one image.

## Quick Start

### Option 1: Using Docker Compose (Recommended)

This will start both the application and PostgreSQL database:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

The application will be available at: `http://localhost:5000`

### Option 2: Using Docker Only (with existing database)

If you have a PostgreSQL database running on your host machine:

**For Linux:**
```bash
# Build the image
docker build -t easyretail-app .

# Run the container (connect to host PostgreSQL)
docker run -d \
  --name easyretail-app \
  --add-host=host.docker.internal:host-gateway \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://postgres:postgres123@host.docker.internal:5432/shop_admin?schema=public" \
  -v $(pwd)/Easyretail/backend/uploads:/app/backend/uploads \
  easyretail-app
```

**Note:** Replace the database credentials and name with your actual values.

## Environment Variables

Create a `.env` file in `Easyretail/backend/` or set environment variables:

- `DATABASE_URL`: PostgreSQL connection string (required)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (default: production)

## Database Setup

The Dockerfile automatically runs Prisma migrations on startup using `prisma migrate deploy`.

For docker-compose, the database is automatically set up with:
- User: `easyretail`
- Password: `easyretail123`
- Database: `easyretail_db`

## Volumes

- `./Easyretail/backend/uploads` is mounted to persist uploaded files

## Troubleshooting

1. **Port 5432 already in use (docker-compose)**: 
   - The docker-compose.yml uses port 5433 on the host to avoid conflicts
   - If you still have issues, stop your local PostgreSQL: `sudo systemctl stop postgresql` (or `sudo service postgresql stop`)
   - Or change the port mapping in docker-compose.yml to a different port

2. **Database connection issues (manual docker run)**:
   - Use `host.docker.internal` instead of `localhost` to connect to host database
   - On Linux, you need `--add-host=host.docker.internal:host-gateway` flag
   - Make sure your host PostgreSQL allows connections (check `pg_hba.conf`)

3. **Migrations fail**: 
   - Check DATABASE_URL is correct
   - Ensure database exists and credentials are valid
   - Check database server is accessible from container

4. **Frontend not loading**: 
   - Check that frontend/dist was built correctly in the image
   - Verify the container logs: `docker logs easyretail-app`

5. **Container exits immediately**:
   - Check logs: `docker logs easyretail-app`
   - Verify DATABASE_URL is set correctly
   - Ensure database is accessible

## Building for Production

The Dockerfile uses multi-stage builds:
- Stage 1: Builds the React frontend
- Stage 2: Sets up Node.js backend and copies the built frontend

This results in a single optimized image containing both frontend and backend.
