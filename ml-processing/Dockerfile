FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /root/.local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy application code
COPY app.py data_processing.py risk_analyzer.py ./
COPY core ./core
COPY utils ./utils
COPY models ./models

# Create directory for models
RUN mkdir -p /app/models/depression_distilbert_model

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV MODEL_DIR=/app/models/depression_distilbert_model

EXPOSE 8080

CMD ["python", "app.py"]