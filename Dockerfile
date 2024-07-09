# Dockerfile
# Stage 1: Build the React application
FROM node:16-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React application with NGINX
FROM nginx:alpine

# Override default.conf
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the Docker host
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
