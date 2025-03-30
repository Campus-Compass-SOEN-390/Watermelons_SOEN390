#!/bin/bash

# ============================
# Dev Helper Script for Expo + Docker + ADB
# ============================

set -e  # Exit immediately on error

# Colors for logging
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Step 1: Reverse ports to Android emulator
function reverse_ports() {
  echo -e "${GREEN}🔄 Reversing ADB ports...${NC}"
  adb reverse tcp:8081 tcp:8081 || true
  adb reverse tcp:19000 tcp:19000 || true
  adb reverse tcp:19001 tcp:19001 || true
  adb reverse tcp:19002 tcp:19002 || true
}

# Step 2: Install expo-dev-client APK to emulator if not already
function install_expo_dev_client() {
  echo -e "${GREEN}📦 Installing Expo Dev Client APK on the emulator...${NC}"

  # Correct and up-to-date download link
  APK_URL="https://expo.dev/client/android.apk"
  APK_NAME="expo-dev-client.apk"

  if [ ! -f "$APK_NAME" ]; then
    echo "Downloading $APK_NAME..."
    curl -L "$APK_URL" -o "$APK_NAME"
  fi

  echo "Installing APK..."
  adb install -r "$APK_NAME" || echo "(APK may already be installed, continuing...)"
}

# Step 3: Launch the Docker environment
function run_docker() {
  echo -e "${GREEN}🐳 Building and launching Docker container...${NC}"
  docker-compose down
  docker-compose up --build
}

# Step 4: Launch the app
function launch_app() {
  echo -e "${GREEN}📱 Launching app on emulator...${NC}"
  adb shell monkey -p host.exp.exponent -c android.intent.category.LAUNCHER 1
}

# ============================
# MAIN
# ============================

reverse_ports
install_expo_dev_client
run_docker
launch_app
