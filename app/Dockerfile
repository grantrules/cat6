FROM node:latest as build-stage



WORKDIR /app

COPY . .

RUN npm install

RUN npm run build



FROM nginx
COPY --from=build-stage /app/build /usr/share/nginx/html