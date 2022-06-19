FROM node:16 AS build-env
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM gcr.io/distroless/nodejs:16
WORKDIR /app
COPY --from=build-env /app/node_modules /app/node_modules
COPY --from=build-env /app/package-lock.json /app/package-lock.json
COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/dist /app

COPY config.json /app/config.json

CMD ["app.js"]
