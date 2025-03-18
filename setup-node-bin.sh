#!/bin/bash

# Set the Node version that matches your build
NODE_VERSION="23.3.0"
NODE_DIR="app/node-bin"

# Ensure the directory exists
mkdir -p $NODE_DIR

# Check if Node is already installed in node-bin
if [ -f "$NODE_DIR/node" ]; then
    echo "Node is already installed in $NODE_DIR"
    exit 0
fi

# Detect OS and Architecture
OS=$(uname -s)
ARCH=$(uname -m)

if [ "$OS" == "Darwin" ]; then
    PLATFORM="darwin"
elif [ "$OS" == "Linux" ]; then
    PLATFORM="linux"
else
    echo "Unsupported OS: $OS"
    exit 1
fi

if [ "$ARCH" == "x86_64" ]; then
    ARCH="x64"
elif [[ "$ARCH" == "arm64" || "$ARCH" == "aarch64" ]]; then
    ARCH="arm64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Download Node binary
NODE_URL="https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-$PLATFORM-$ARCH.tar.gz"
echo "⬇Downloading Node.js from $NODE_URL"
curl -L $NODE_URL -o node.tar.gz

# Extract Node binary
echo "Extracting Node..."
tar -xzf node.tar.gz --strip-components=1 -C $NODE_DIR
rm node.tar.gz

# Make node executable
chmod +x $NODE_DIR/bin/node

echo "Node.js $NODE_VERSION installed in $NODE_DIR"
