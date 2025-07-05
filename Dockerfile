FROM node:lts-alpine as build

WORKDIR /app

COPY FrontEnd/pwa-store/package*.json ./
RUN npm install --registry="https://mirror-npm.runflare.com"

COPY FrontEnd/pwa-store/ ./
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
