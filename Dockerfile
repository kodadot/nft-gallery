# Dockerfile
FROM node:16

WORKDIR /kodadotapp

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=9090

CMD [ "yarn", "dev-docker" ]
