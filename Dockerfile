FROM oven/bun:1 as base

WORKDIR /usr/src/app

COPY . .

RUN bun install

RUN bun run build

ENTRYPOINT ["bun", "run", "./build"]
