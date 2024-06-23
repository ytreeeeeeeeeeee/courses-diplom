FROM node:18.18 AS builder

WORKDIR /back

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.18 AS production

WORKDIR /back

ARG NODE_ENV=production
ENV NODE_ENV production

COPY --from=builder /back/package*.json ./
COPY --from=builder /back/node_modules ./node_modules
COPY --from=builder /back/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]