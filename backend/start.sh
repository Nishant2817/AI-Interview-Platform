#!/bin/sh

echo "Starting FastAPI..."

# Parse DB host/port from DATABASE_URL if available, otherwise use Docker defaults
if [ -n "$DATABASE_URL" ]; then
    # Extract host and port from DATABASE_URL (format: postgresql://user:pass@host:port/db)
    DB_HOST=$(echo "$DATABASE_URL" | sed -e 's|.*@||' -e 's|/.*||' -e 's|:.*||')
    DB_PORT=$(echo "$DATABASE_URL" | sed -e 's|.*@||' -e 's|/.*||' -e 's|.*:||')
    DB_USER=$(echo "$DATABASE_URL" | sed -e 's|.*://||' -e 's|:.*||')
    # Use defaults if parsing fails
    DB_PORT=${DB_PORT:-5432}
else
    DB_HOST="postgres"
    DB_PORT="5432"
    DB_USER="postgres"
fi

echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT"
do
  echo "Waiting..."
  sleep 2
done

echo "Running Alembic migrations..."

alembic upgrade head

echo "Starting FastAPI..."

exec uvicorn app.main:app --host 0.0.0.0 --port 8000