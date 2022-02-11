#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/book-webshop-client /usr/share/nginx/html

# OR manually do ng build --prod and just copy from dist
#FROM nginx:alpine
#COPY ./dist/book-webshop-client ./usr/share/nginx/html