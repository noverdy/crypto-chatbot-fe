FROM node:18-alpine

USER node
WORKDIR /app

COPY ./src .
COPY .env .
RUN npm ci

CMD ["npm", "run", "dev"]