# 🚀 Getting Started

Follow the steps below to set up and run the project locally using Docker.

## Prerequisites

Ensure you have the following installed:

* Node.js (v22 or later)
* Docker Desktop
* Git

Start Docker Desktop and wait until the Docker Engine is running before continuing.

---

# 1. Clone the Repository

```bash
git clone https://github.com/iamzehan/RacoAI_Backend_Assessment.git
cd RacoAI_Backend_Assessment
```

---

# 2. Create Your Environment File

Copy the example environment file.

```bash
cp .env.example .env
```

If you're using Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open the newly created `.env` file and configure your environment variables.

For local Docker development, ensure the following values are configured correctly:

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

DATABASE_URL=postgresql://your_username:your_password@postgres:5432/your_database?schema=public

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
```

---

# 3. Start Docker

Build and start all required services.

```bash
docker-compose up --build
```

This command will:

* Build the Node.js application image.
* Start the Express API container.
* Start the PostgreSQL container.
* Start the Redis container.
* Create a Docker network so the services can communicate using their service names.

---

# 4. Run Database Migrations

Open a new terminal and execute:

```bash
docker exec -it racoai-api npx prisma migrate deploy
```

This command applies all existing Prisma migrations to the PostgreSQL database running inside Docker.

---

# 5. Seed the Database

Populate the database with the default administrator account and sample products.

```bash
docker exec -it racoai-api npx prisma db seed
```

---

# 6. Verify the Application

Once the containers have started successfully, the API will be available at:

```
http://localhost:3000
```

If a health endpoint is available:

```
GET http://localhost:3000/health
```

---

# Development Workflow

Start the application:

```bash
docker-compose up
```

Run in detached mode:

```bash
docker-compose up -d
```

Stop the application:

```bash
docker-compose down
```

Rebuild the application after Dockerfile or dependency changes:

```bash
docker-compose up --build
```

---

# Viewing Logs

View logs for all services:

```bash
docker-compose logs -f
```

View only the API logs:

```bash
docker-compose logs -f app
```

---

# Project Architecture

The application runs as three separate Docker containers.

```
┌───────────────────────────────┐
│          Docker Network        │
│                               │
│  ┌──────────┐                 │
│  │ Node API │                 │
│  └────┬─────┘                 │
│       │                       │
│  ┌────▼────┐   ┌───────────┐   │
│  │Postgres │   │   Redis   │   │
│  └─────────┘   └───────────┘   │
└───────────────────────────────┘
```

Services communicate using Docker service names:

* PostgreSQL → `postgres`
* Redis → `redis`

No service should use `localhost` to communicate with another container.

---

# Database Migrations

This project uses Prisma Migrations.

Create a new migration:

```bash
docker exec -it racoai-api npx prisma migrate dev --name <migration_name>
```

Apply existing migrations:

```bash
docker exec -it racoai-api npx prisma migrate deploy
```

Generate the Prisma Client:

```bash
docker exec -it racoai-api npx prisma generate
```

Open Prisma Studio:

```bash
docker exec -it racoai-api npx prisma studio
```

---

# Reset the Database

To completely reset the database:

```bash
docker-compose down -v
```

Then rebuild:

```bash
docker-compose up --build
```

Run migrations again:

```bash
docker exec -it racoai-api npx prisma migrate deploy
```

Finally, reseed the database:

```bash
docker exec -it racoai-api npx prisma db seed
```

---

# Common Issues

### Redis Connection Refused

Ensure Redis is configured using the Docker service name:

```env
REDIS_URL=redis://redis:6379
```

Never use:

```env
REDIS_URL=redis://localhost:6379
```

inside Docker.

---

### PostgreSQL Connection Refused

Ensure the database hostname is:

```
postgres
```

not:

```
localhost
```

inside the Docker network.

---

### Docker Compose Not Found

If `docker compose` is unavailable, use:

```bash
docker-compose up --build
```

or update Docker Desktop to the latest version.

---

# Shutting Down

Stop all containers:

```bash
docker-compose down
```

Remove containers and volumes:

```bash
docker-compose down -v
```

Removing volumes deletes the PostgreSQL and Redis data permanently.

This guide gives a reviewer everything they need to clone the repository, configure the environment, start the Docker services, apply Prisma migrations, seed the database, and troubleshoot common issues. It also explains *why* each step is necessary, making it suitable for both assessment reviewers and future contributors.
