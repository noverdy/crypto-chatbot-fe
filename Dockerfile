FROM node:18-alpine

WORKDIR /app

COPY ./src .
COPY .env .
RUN npm ci

CMD ["npm", "run", "dev"]