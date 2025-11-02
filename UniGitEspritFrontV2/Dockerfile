# Build Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/uni-git-esprit-front-v2 /usr/share/nginx/html
EXPOSE 80
