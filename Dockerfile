# Stage 1: Build the React application
FROM node:16-alpine AS build

WORKDIR /app

# Install dependencies
COPY /slideshow-frontend/package*.json ./
RUN npm install

# Copy application code
COPY /slideshow-frontend .

# Build the React app
RUN npm run build

# Stage 2: Set up the proxy server and serve the React application with NGINX
FROM node:16-alpine AS proxy-build

WORKDIR /proxy

# Copy proxy server code and install dependencies
COPY /proxy-backend/package*.json ./
RUN npm install
COPY /proxy-backend .

# Build the TypeScript proxy server
RUN npm run build

# Stage 3: Serve the React application with NGINX and run the proxy server
FROM nginx:alpine

# Copy proxy server build
COPY --from=proxy-build /proxy/dist /usr/src/app

# Install Node.js for running the proxy server
RUN apk add --no-cache nodejs npm

# Install dependencies in the final image
WORKDIR /usr/src/app
COPY /proxy-backend/package*.json ./
RUN npm install

# Copy NGINX configuration
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
COPY /nginx/shared.conf /etc/nginx/shared.conf

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose ports
EXPOSE 80
EXPOSE 3000

# Start both NGINX and the proxy server
CMD ["sh", "-c", "node /usr/src/app/app.js & nginx -g 'daemon off;'"]
