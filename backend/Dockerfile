FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (gcc needed for some python packages)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Expose port 8000
EXPOSE 8000

# Run the application from the correct directory
CMD ["sh", "-c", "cd /app && uvicorn main:app --host 0.0.0.0 --port 8000"]
