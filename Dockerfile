# Dockerfile
FROM node:16.13.1-alpine3.14

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN apk add --no-cache git
RUN yarn install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 9090

CMD [ "yarn", "dev" ]
