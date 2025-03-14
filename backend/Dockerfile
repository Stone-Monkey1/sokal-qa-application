# Use the official Node.js image
FROM mcr.microsoft.com/playwright:focal

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port (Render will automatically assign one)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
