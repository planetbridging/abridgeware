FROM alpine:3.14

ENV NODE_VERSION 16.14.2
RUN apk add --no-cache nodejs npm
WORKDIR /app


COPY . /app


RUN npm install


EXPOSE 8123


ENTRYPOINT ["node"]

CMD ["index.js"]