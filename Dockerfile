# Dockerfile
FROM node:16

WORKDIR /kodadot-app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 9090

CMD [ "yarn", "dev-docker" ]
