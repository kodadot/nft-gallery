# Dockerfile
FROM node:lts

WORKDIR /kodadot-app

EXPOSE 9090

COPY package.json /kodadot-app/package.json

RUN yarn install
RUN yarn build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=9090

CMD [ "yarn", "dev" ]
