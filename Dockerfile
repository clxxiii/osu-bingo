FROM node:21 as base

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT ["node", "./build"]
