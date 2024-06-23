FROM oven/bun:1 as base

WORKDIR /usr/src/app

COPY . .

RUN bun install

ENV DATABASE_URL=file:/db/dev.db

RUN mkdir /db

RUN bun migrate

RUN bun install

RUN bun run build

ENTRYPOINT ["bun", "run", "./build"]
