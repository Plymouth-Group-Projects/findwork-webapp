#Build stage
FROM node:23-alpine3.20 AS build

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:23-alpine3.20 AS production

COPY --from=build /src/.next ./.next
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/public ./public
COPY --from=build /src/package.json ./package.json

CMD ["npm", "start"]