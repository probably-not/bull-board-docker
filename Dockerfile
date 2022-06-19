FROM node:16 AS build-env
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./dist .
COPY config.json /app/config.json
CMD ["app.js"]
