# Use Node.js official image as the base
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the gRPC server port (e.g., 50051)
EXPOSE 50051

# Start the gRPC server
CMD ["npm", "start"]
