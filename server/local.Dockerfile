FROM node:10.16.3 AS build
WORKDIR /usr/src/app

RUN npm i -g yarn
RUN npm i -g typescript
RUN npm i -g ts-node-dev

ADD package.json .
RUN yarn

ADD tsconfig.json .

EXPOSE 80
CMD ts-node-dev ./src/index.ts