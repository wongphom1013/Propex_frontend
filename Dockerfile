FROM node:lts-alpine

RUN apk add --no-cache libc6-compat git python3 make g++

RUN mkdir -p /app

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY .env .env

COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]