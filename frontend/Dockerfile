# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept build arguments for Vite
ARG VITE_API_URL
ARG VITE_SOCKET_URL

# Set them as environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if you had one, 
# but for this app the default is fine.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
