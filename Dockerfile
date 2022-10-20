# Dockerfile
FROM node:16

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 9090

CMD [ "pnpm", "dev" ]
