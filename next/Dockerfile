FROM node:18-slim AS deps
# RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN  yarn --frozen-lockfile

COPY . .

ARG EXTERNAL_API
ENV NEXT_PUBLIC_API_URL=$EXTERNAL_API

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn next build
# Expose port
EXPOSE 3000

RUN du -sh /app
RUN sh -c "du -sh /app"

# Start the application
CMD ["yarn", "start" ]
