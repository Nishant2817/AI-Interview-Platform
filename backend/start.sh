#!/bin/sh

echo "Waiting for PostgreSQL..."

until pg_isready -h postgres -p 5432 -U postgres
do
  sleep 2
done

echo "Running Alembic migrations..."

alembic upgrade head

echo "Starting FastAPI..."

exec uvicorn app.main:app --host 0.0.0.0 --port 8000