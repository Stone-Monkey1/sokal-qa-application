#!/bin/bash

echo "Installing backend dependencies..."
cd backend && npm install

echo "Installing frontend dependencies..."
cd ../frontend && npm install

echo "Checking for Aspell..."
if ! command -v aspell &> /dev/null
then
    echo "Aspell is not installed. Installing now..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt update && sudo apt install aspell aspell-en -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install aspell
    else
        echo "Please install aspell manually."
    fi
else
    echo "Aspell is already installed."
fi

echo "Setup complete!"
