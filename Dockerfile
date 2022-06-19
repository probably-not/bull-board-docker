FROM node:16 AS build-env
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./dist .

FROM gcr.io/distroless/nodejs:16
WORKDIR /app

COPY --from=build-env /app /app
COPY config.json /app/config.json

CMD ["app.js"]
