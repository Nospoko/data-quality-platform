FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN  yarn --frozen-lockfile

COPY . /app

ARG EXTERNAL_API
ENV NEXT_PUBLIC_API_URL=$EXTERNAL_API

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn next build
# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start" ]
