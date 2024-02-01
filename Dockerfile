# Dockerfile
FROM node:20

# Set the same pnpm version as the version in the package.json
ENV PNPM_VERSION 8.6.0

RUN npm i -g pnpm@$PNPM_VERSION
WORKDIR /app

COPY . .
RUN pnpm install

ENV HOST 0.0.0.0
EXPOSE 9090

ENV PATH ./node_modules/.bin/:$PATH
