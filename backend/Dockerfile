# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download the spaCy model
RUN python -m spacy download en_core_web_sm

# Copy the backend code into the container
# Since this Dockerfile is inside backend/, we copy the current directory (.) to /app/backend
# However, the app expects to run from the root of the repo usually (backend.app.main)
# So we need to structure it so that /app/backend exists.
COPY . ./backend

# Create the data directory
RUN mkdir -p backend/data

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV PORT 8080

# Run app.py when the container launches
# We need to set PYTHONPATH to /app so that "backend.app.main" works
ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
