FROM node:14 as builder

### RUN npm install -g yarn

RUN yarn global add http-server

WORKDIR /dashboard

### leverage docker fs cache http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package.json .

COPY yarn.lock .

COPY . .

RUN yarn build

EXPOSE 8080
CMD ["http-server", "dist"]
