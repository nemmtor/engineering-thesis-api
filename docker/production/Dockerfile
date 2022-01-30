FROM node:16.13 AS builder

WORKDIR /api

COPY package*.json ./

COPY prisma ./prisma

# RUN apk update

# RUN apk add --update alpine-sdk

# RUN apk add --update python3

RUN npm ci

COPY . .

RUN npm run build

FROM node:16.13 AS production


WORKDIR /api

COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/package*.json ./
COPY --from=builder /api/scripts/start.prod.sh ./
COPY --from=builder /api/dist ./dist
COPY --from=builder /api/prisma ./prisma
COPY --from=builder /api/fonts ./fonts


EXPOSE 3000
CMD [ "node", "dist/main" ]
