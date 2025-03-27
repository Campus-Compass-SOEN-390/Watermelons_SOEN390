#!/bin/bash

echo "🚀 Starting the full development environment..."

# Build the images
docker-compose build

# Start the containers
docker-compose up --remove-orphans
