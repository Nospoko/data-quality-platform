FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .


ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn next build
# Expose port
EXPOSE 3000

# Start the application
# CMD [ "yarn", "start" ]
CMD ["yarn", "migrate", "&&", "yarn", "start"]
