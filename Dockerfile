# Stage 1: Build the website
FROM node:lts-alpine AS build

COPY . /app

# Install the deps & build the website
RUN cd /app && npm i && npm run build

# Stage 2: Install the cli & server
FROM node:lts-alpine

ENV SERVER_PORT=80
ENV SERVER_STATICS=/palantir

RUN mkdir /palantir
RUN mkdir /docker-entrypoint.d

# Create the flexible docker entrypoints
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Backwards compat
RUN ln -s usr/local/bin/docker-entrypoint.sh /

COPY . /app
COPY --from=build /app/dist /app/dist

WORKDIR /app

# Install only the production deps & install the cli as global
RUN npm i --production && npm pack && npm i -g palantir-*.tgz && rm palantir-*.tgz

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
