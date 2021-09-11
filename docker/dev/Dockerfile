FROM node:14

WORKDIR /api

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
