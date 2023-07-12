FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN  yarn --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG EXTERNAL_API
ENV NEXT_PUBLIC_API_URL=$EXTERNAL_API

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn next build
# Expose port
EXPOSE 3000

# Start the application
CMD [ "yarn", "start" ]
