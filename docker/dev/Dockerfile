FROM node:16.13

WORKDIR /api

# RUN apk update

# RUN apk add --update alpine-sdk

# RUN apk add --update python3

# RUN apk add --update libc6-compat

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
