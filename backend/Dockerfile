# Use Playwright's official Docker image (comes with all required dependencies)
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Install Playwright browsers (fixes missing Chromium issue)
RUN npx playwright install --with-deps chromium

# Expose the port Render assigns dynamically
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
