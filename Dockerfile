# Dockerfile
FROM node:18

RUN npm i -g pnpm
WORKDIR /app

COPY . .
RUN pnpm install

ENV HOST 0.0.0.0
EXPOSE 9090

ENV PATH ./node_modules/.bin/:$PATH
