# Dockerfile for React
FROM node:20.13.1 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Use a minimal server to serve the build files
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
