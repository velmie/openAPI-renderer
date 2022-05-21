FROM node:14-alpine3.15 AS build

WORKDIR /openapi-renderer
COPY package*.json ./
RUN npm install
COPY . .


FROM node:14-alpine3.15

ENV PORT 80

WORKDIR /app
COPY --from=build /openapi-renderer /app/

EXPOSE 80

CMD ["npm", "start"]
