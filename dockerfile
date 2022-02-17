FROM node:latest

WORKDIR /usr/app/three

COPY package.json .

RUN npm i

COPY . .

CMD npm run dev