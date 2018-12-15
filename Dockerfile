# Stage 1: Build the website
FROM node:lts-alpine AS build

COPY . /app

WORKDIR /app

# Install the deps & build the website
RUN npm i && npm run build

# Stage 2: Install the server
FROM node:lts-alpine

ENV SERVER_PORT=80
ENV SERVER_STATICS=/palantir

RUN mkdir /palantir

COPY . /app
COPY --from=build /app/dist /app/dist

WORKDIR /app

# Install only the production deps
RUN npm i --production

EXPOSE 80

CMD ["npm", "start"]
