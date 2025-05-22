# Build stage
FROM node:latest AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM alpine:latest AS production-stage
RUN apk add --no-cache nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /run/nginx
EXPOSE 9010
CMD ["nginx", "-g", "daemon off;"]