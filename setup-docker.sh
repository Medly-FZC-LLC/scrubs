#!/bin/bash

echo "=== Slebot Website Docker Setup ==="
echo "This script will help you install Docker and run your dockerized website."
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. You need to install Docker first."
    echo "Please visit https://docs.docker.com/desktop/install/mac-install/ to download Docker Desktop for Mac."
    echo
    echo "After installing Docker Desktop:"
    echo "1. Open Docker Desktop application"
    echo "2. Wait for Docker to start (you'll see the Docker icon in the menu bar)"
    echo "3. Run this script again"
    exit 1
else
    echo "✅ Docker is installed."
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop and run this script again."
    exit 1
else
    echo "✅ Docker is running."
fi

echo
echo "Building and starting the Docker container for Slebot website..."
echo

# Build and run the Docker container
docker-compose up -d --build

# Check if the container is running
if [ $? -eq 0 ]; then
    echo
    echo "✅ Slebot website is now running in Docker!"
    echo "You can access it at: http://localhost:8080"
    echo
    echo "To stop the website, run: docker-compose down"
    echo "To view logs, run: docker-compose logs -f"
else
    echo
    echo "❌ There was an error starting the Docker container."
    echo "Please check the error messages above."
fi
