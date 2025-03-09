# Use an official Node LTS image. Adjust the tag if you need a different version.
FROM node:18-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package manifests first so Docker can cache installs if they don't change
COPY package*.json ./

# Install dependencies (using npm ci to ensure a clean, reproducible install)
RUN npm ci

# Globally install Expo CLI
RUN npm install -g expo-cli

# Copy the rest of your project files into the container
COPY . .

# Expose Expo’s default ports:
#   19000 for the Expo dev server,
#   19001 for the Metro bundler,
#   19002 for Expo Dev Tools.
EXPOSE 19000 19001 19002

# By default, run Expo in tunnel mode (makes it easier to access on different networks)
CMD ["npm", "start", "--tunnel"]
