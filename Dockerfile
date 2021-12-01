# Dockerfile
FROM node:14.18.1

WORKDIR /kodadot-app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV HOST 0.0.0.0
EXPOSE 9000

CMD [ "yarn", "dev" ]
