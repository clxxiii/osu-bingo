# Build Container
FROM node:21-alpine3.17 AS build
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

# Setup Run Machine
FROM node:21-alpine3.17 AS dev
WORKDIR /app
COPY --from=build /build .
RUN npm install --omit=dev

ENTRYPOINT ["node", "/app/build"]
