FROM node:14-alpine AS builder

WORKDIR /api

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install --production

COPY . .

RUN npm run build

FROM node:14-alpine AS production

COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/package*.json ./
COPY --from=builder /api/scripts/start.prod.sh ./
COPY --from=builder /api/dist ./dist
COPY --from=builder /api/prisma ./


EXPOSE 3000
CMD [ "node", "dist/main" ]
