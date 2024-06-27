# Dockerfile
# Stage 1: Build the React application
FROM node:16-alpine AS build


# Build args
ARG IMMICH_API_BASE_URL
ARG OPENWEATHERMAP_API_KEY
ARG IMMICH_API_KEY
ARG IMMICH_ALBUM_IDS
ARG SLIDESHOW_INTERVAL_SECONDS
ARG ALBUM_UPDATE_INTERVAL_MINUTES

# Environment vars
ENV REACT_APP_IMMICH_API_BASE_URL=$IMMICH_API_BASE_URL
ENV REACT_APP_OPENWEATHERMAP_API_KEY=$OPENWEATHERMAP_API_KEY
ENV REACT_APP_IMMICH_API_KEY=$IMMICH_API_KEY
ENV REACT_APP_IMMICH_ALBUM_IDS=$IMMICH_ALBUM_IDS
ENV REACT_APP_SLIDESHOW_INTERVAL_SECONDS=$SLIDESHOW_INTERVAL_SECONDS
ENV REACT_APP_ALBUM_UPDATE_INTERVAL_MINUTES=$ALBUM_UPDATE_INTERVAL_MINUTES

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

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the Docker host
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
