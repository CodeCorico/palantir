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
RUN mkdir /docker-entrypoint.d

# Create the flexible docker entrypoints
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
# Backwards compat
RUN ln -s usr/local/bin/docker-entrypoint.sh /

COPY . /app
COPY --from=build /app/dist /app/dist

WORKDIR /app

# Install only the production deps
RUN npm i --production

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
