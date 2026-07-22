# Base Image
FROM python:3.12-slim

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Working directory
WORKDIR /app
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .
RUN chown -R appuser:appgroup /app

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI
RUN chmod +x start.sh
USER appuser
CMD ["./start.sh"]