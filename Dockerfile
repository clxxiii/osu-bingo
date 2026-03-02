# Build Container
FROM node:24-alpine AS build
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

# Setup Run Machine
FROM node:24-alpine AS dev
WORKDIR /app
COPY --from=build /build .
RUN npm install --omit=dev

ENTRYPOINT ["node", "/app/build"]
