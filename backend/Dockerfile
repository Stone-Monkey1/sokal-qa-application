FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Ensure required system packages are installed (fixes permission issues)
RUN apt-get update && apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 libgtk-3-0 libx11-xcb1

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Ensure Playwright browsers have execution permissions
RUN chmod -R 777 /ms-playwright

# Expose the port Render assigns dynamically
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
