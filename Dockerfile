FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY ./src /usr/src/app/
COPY ./nest-cli.json /usr/src/app/

RUN npm run build
