FROM node:20.15.0-alpine3.20
WORKDIR /usr/src/app

ARG SECRET

ENV SECRET=$SECRET

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD [ "node", "index.js"]