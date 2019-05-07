FROM mhart/alpine-node:11 AS builder
WORKDIR /app
COPY . .
RUN yarn global add react
RUN yarn run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "2345", "-s", "build"]
