FROM node:lts-alpine

ENV SERVER_PORT=80
ENV SERVER_STATICS=/palantir

RUN mkdir -p /palantir

COPY . /app

RUN ls -al /app

WORKDIR /app

RUN cd /app && npm i && npm run build

EXPOSE 80

CMD ["npm", "start"]
