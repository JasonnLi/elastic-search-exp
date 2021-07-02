FROM node:12.16.2 AS build

RUN yarn global add webpack
RUN yarn global add webpack-cli
RUN yarn global add webpack-dev-server

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY postcss.config.js .

# Get dependencies
RUN yarn

# Get source and configs
COPY webpack.config.js .
#COPY webpack webpack
COPY index.html .

EXPOSE 80

ENV NODE_ENV=localdocker
CMD npm run serve
