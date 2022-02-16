# Dockerfile
FROM node:16.14.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 9090

CMD [ "yarn", "dev" ]
