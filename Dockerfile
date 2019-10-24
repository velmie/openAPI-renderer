FROM node:8 AS build

WORKDIR /openapi-renderer
COPY package*.json ./
RUN npm install
COPY . .


FROM node:alpine

ENV PORT 80

WORKDIR /app
COPY --from=build /openapi-renderer /app/

EXPOSE 80

CMD ["npm", "start"]
