# Use an official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for dependency caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy the entire project into the container
COPY . .

# Expose necessary Expo ports
EXPOSE 19000 19001 19002

# Start Expo
CMD ["npm", "run", "start"]
